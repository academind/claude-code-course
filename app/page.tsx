import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <main className="max-w-md text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Notes</h1>
        <p className="text-gray-600 mb-8">
          A simple note-taking app with rich text editing and public sharing.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/authenticate"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Log in
          </Link>
          <Link
            href="/authenticate"
            className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100"
          >
            Sign up
          </Link>
        </div>
      </main>
    </div>
  );
}
