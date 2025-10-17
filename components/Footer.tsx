"use client";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 text-center text-xs text-slate-500">
        MVP éducatif — non-conseil financier • <a href="/legal" className="underline-offset-2 hover:underline">Légal</a>
        <span className="mx-2">•</span>
        <button
          onClick={() => { try { const v = localStorage.getItem('investy_debug') === 'on' ? 'off' : 'on'; localStorage.setItem('investy_debug', v); location.reload(); } catch {} }}
          className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 ml-1"
          aria-label="Basculer le mode debug"
        >
          Debug
        </button>
      </div>
    </footer>
  );
}


