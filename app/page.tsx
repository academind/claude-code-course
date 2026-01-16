export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <main className="max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Claude Code</h1>
        <h2 className="text-xl text-center mb-6">Main Advantages</h2>
        <ul className="space-y-4 text-lg">
          <li>
            <strong>Terminal Integration</strong> - Works directly in your CLI
            for seamless workflow
          </li>
          <li>
            <strong>Full Codebase Understanding</strong> - Reads and analyzes
            entire projects to provide context-aware assistance
          </li>
          <li>
            <strong>Real Code Changes</strong> - Makes actual edits to files,
            not just suggestions
          </li>
          <li>
            <strong>Command Execution</strong> - Runs shell commands, tests, and
            builds directly
          </li>
          <li>
            <strong>Git Integration</strong> - Commits changes, creates
            branches, and opens pull requests
          </li>
          <li>
            <strong>Interactive Workflow</strong> - Asks clarifying questions to
            ensure accurate results
          </li>
        </ul>
      </main>
    </div>
  );
}
