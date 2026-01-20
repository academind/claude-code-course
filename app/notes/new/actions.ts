"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  content_json: z.string().min(1, "Content is required"),
});

export type ActionResult = {
  success?: boolean;
  error?: {
    title?: string[];
    content_json?: string[];
    general?: string;
  };
};

// Validate and sanitize URLs to prevent javascript: and other dangerous protocols
function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url, "https://example.com");
    if (["http:", "https:"].includes(parsed.protocol)) {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}

// Recursively sanitize text content in TipTap JSON structure
function sanitizeTipTapNode(node: unknown): unknown {
  if (typeof node !== "object" || node === null) {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(sanitizeTipTapNode);
  }

  const obj = node as Record<string, unknown>;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key === "text" && typeof value === "string") {
      sanitized[key] = DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    } else if (key === "attrs" && typeof value === "object" && value !== null) {
      // Sanitize attributes - especially href and src
      const attrs = value as Record<string, unknown>;
      const sanitizedAttrs: Record<string, unknown> = {};
      for (const [attrKey, attrValue] of Object.entries(attrs)) {
        if (
          (attrKey === "href" || attrKey === "src") &&
          typeof attrValue === "string"
        ) {
          const safeUrl = sanitizeUrl(attrValue);
          if (safeUrl) sanitizedAttrs[attrKey] = safeUrl;
        } else if (typeof attrValue === "string") {
          sanitizedAttrs[attrKey] = DOMPurify.sanitize(attrValue, {
            ALLOWED_TAGS: [],
          });
        } else {
          sanitizedAttrs[attrKey] = attrValue;
        }
      }
      sanitized[key] = sanitizedAttrs;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(sanitizeTipTapNode);
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeTipTapNode(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function sanitizeContent(jsonString: string): string {
  try {
    const content = JSON.parse(jsonString);
    return JSON.stringify(sanitizeTipTapNode(content));
  } catch {
    return "{}";
  }
}

export async function createNote(formData: FormData): Promise<ActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authenticate");
  }

  const result = createNoteSchema.safeParse({
    title: formData.get("title"),
    content_json: formData.get("content_json"),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { title, content_json } = result.data;
  const sanitizedTitle = DOMPurify.sanitize(title, { ALLOWED_TAGS: [] });
  const sanitizedContent = sanitizeContent(content_json);
  const id = crypto.randomUUID();

  try {
    db.run(
      `INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)`,
      [id, session.user.id, sanitizedTitle, sanitizedContent]
    );
  } catch {
    return { error: { general: "Failed to create note. Please try again." } };
  }

  redirect(`/notes/${id}`);
}
