"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "investy_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(CONSENT_KEY);
    if (!v) setVisible(true);
  }, []);

  function setConsent(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="container mb-4 rounded-md border bg-white p-3 shadow-sm text-sm text-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="flex-1">
            Nous utilisons des cookies techniques et de mesure. Vous pouvez refuser ou accepter. <Link href="/legal#cookies" className="underline underline-offset-2">En savoir plus</Link>.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConsent("rejected")}
              aria-label="Refuser les cookies"
              className="rounded-md border px-3 py-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2"
            >
              Refuser
            </button>
            <button
              onClick={() => setConsent("accepted")}
              aria-label="Accepter les cookies"
              className="rounded-md bg-accent text-white px-3 py-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


