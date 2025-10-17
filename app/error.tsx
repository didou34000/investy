"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <section className="container py-16">
          <h1 className="text-2xl font-semibold">Une erreur est survenue</h1>
          <p className="mt-2 text-sm text-slate-600">{error.message}</p>
          <button className="mt-4 rounded-md border px-3 py-2" onClick={() => reset()} aria-label="Réessayer">
            Réessayer
          </button>
        </section>
      </body>
    </html>
  );
}


