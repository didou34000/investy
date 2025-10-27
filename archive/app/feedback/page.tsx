"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FeedbackRow = { id?: string; email?: string | null; message: string; created_at?: number };

export default function FeedbackPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!message.trim()) return;
    setLoading(true);
    await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, message }) });
    setMessage("");
    await load();
    setLoading(false);
  }

  async function load() {
    const r = await fetch("/api/feedback").then((x) => x.json()).catch(() => ({ feedback: [] }));
    setRows(r.feedback ?? []);
  }

  useEffect(() => { load(); }, []);

  return (
    <section className="container section-y max-w-3xl">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Vos retours comptent</h1>
        <p className="text-slate-600">Aidez-nous à améliorer Investy. Merci pour votre temps !</p>
      </div>

      <div className="mt-8 card grid gap-3">
        <Input className="input" type="email" placeholder="Votre email (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea className="input min-h-32" rows={5} placeholder="Votre message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button className="btn btn-primary w-full" onClick={submit} aria-label="Envoyer le feedback" disabled={loading}>{loading ? "Chargement…" : "Envoyer"}</Button>
      </div>

      <h2 className="mt-10 text-lg font-semibold">Derniers retours</h2>
      <div className="mt-3 card divide-y divide-slate-100">
        {rows.length === 0 && (
          <div className="text-sm text-slate-600">Aucun feedback pour l’instant.</div>
        )}
        {rows.map((r, i) => (
          <div key={(r.id ?? i) as any} className="py-3 text-sm">
            <div className="text-slate-600">{new Date((r.created_at ?? Date.now())).toLocaleString()}</div>
            {r.email && <div className="text-slate-700">{r.email}</div>}
            <div className="mt-1">{r.message}</div>
          </div>
        ))}
      </div>
    </section>
  );
}


