"use client";
import { useEffect, useState } from "react";

type Props = {
  risk: number;
  drawdownTolerance: number;
  reinvest: boolean;
  monthly: number;
  horizon: number;
};

export default function SaveProfileCard(props: Props) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user ?? null))
      .catch(() => {});
  }, []);

  async function save() {
    if (!user) {
      setError("Connecte-toi pour enregistrer ton profil.");
      return;
    }
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/save-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          result: {
            risk_index: Math.round(props.risk),
            profile_label: name || "Profil personnalisé",
            expected_return: Math.min(3 + props.risk * 0.12, 14),
          },
          answers: {},
        }),
      });
      if (res.ok) setMessage("Profil enregistré avec succès !");
      else throw new Error("Erreur");
    } catch {
      setError("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <p className="text-sm text-slate-600 mb-3">Connecte-toi pour sauvegarder ton profil.</p>
        <a href="/auth" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium">
          Se connecter
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
      <h3 className="font-semibold text-slate-900">Enregistrer le profil</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nom du profil (optionnel)"
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <button onClick={save} disabled={saving}
        className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
