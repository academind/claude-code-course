import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type Params = Promise<{ id: string }>;

interface Note {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
}

export default async function NoteEditor({ params }: { params: Params }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/authenticate");
  }

  const { id } = await params;

  // Ownership check: only note owner can view/edit
  const note = db
    .query<Note, [string, string]>(
      "SELECT * FROM notes WHERE id = ? AND user_id = ?"
    )
    .get(id, session.user.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Note Editor</h1>
      <p className="text-foreground/60 mb-4">Editing: {note.title}</p>
    </div>
  );
}
