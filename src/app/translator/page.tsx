export default function TranslatorPage() {
  return (
  <section className="mx-auto flex max-w-4xl flex-col gap-8 py-16 px-6 text-[var(--foreground)]">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Morse Code Translator</h1>
  <p className="text-sm text-[var(--muted-foreground)]">
          Core translator experience including conversion, audio playback, and sharing tools.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Text → Morse</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for text input, conversion logic, and output formatting.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Morse → Text</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for Morse code parsing, validation, and text rendering.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Audio Playback</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for playback controls and tone generation.
          </p>
        </article>
  <article className="rounded border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <h2 className="text-lg font-medium">Copy & Share</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Placeholder for clipboard helpers, share targets, and QR export.
          </p>
        </article>
      </div>
    </section>
  );
}
