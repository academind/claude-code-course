export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Hello World</h1>
        <h2 className="text-2xl font-semibold mb-4">Advantages of Claude Code</h2>
        <ul className="text-left list-disc list-inside space-y-2">
          <li>Works directly in your terminal with full codebase access</li>
          <li>Understands project context and can navigate large codebases</li>
          <li>Executes commands, runs tests, and fixes errors autonomously</li>
          <li>Supports multi-file edits and complex refactoring tasks</li>
          <li>Integrates with git for commits, PRs, and version control</li>
        </ul>
      </main>
    </div>
  );
}
