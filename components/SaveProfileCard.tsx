"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  risk: number;
  drawdownTolerance: number;
  reinvest: boolean;
  monthly: number;
  horizon: number;
};

export default function SaveProfileCard(props: Props) {
  const [session, setSession] = useState<any>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function save() {
    setSaving(true); setMessage(null); setError(null);
    try {
      const user = session?.user ?? null;
      if (!user) {
        setError("Veuillez vous connecter via le lien email pour enregistrer votre profil.");
        setSaving(false);
        return;
      }
      const payload = {
        user_id: user.id,
        email: user.email,
        name,
        risk_index: Math.round(props.risk),
        drawdown_tolerance: Math.round(props.drawdownTolerance),
        reinvest: props.reinvest,
        monthly: Math.round(props.monthly),
        horizon: Math.round(props.horizon),
      };

      // upsert profil courant
      const { error: upsertErr } = await supabase.from("users_profiles")
        .upsert(payload, { onConflict: "user_id" });
      if (upsertErr) throw upsertErr;

      // historiser snapshot
      const { error: histErr } = await supabase.from("users_profile_history")
        .insert({ user_id: user.id, email: user.email, payload });
      if (histErr) throw histErr;

      setMessage("Profil enregistré avec succès.");
    } catch (e:any) {
      setError(e?.message ?? "Erreur d'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="font-medium mb-2">Enregistrer mon profil</div>
      {!session && (
        <div className="text-sm text-amber-700 mb-2">
          Vous n'êtes pas connecté. Utilisez la carte "Créer un espace" ci-dessus pour recevoir un lien sécurisé par email.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-2">
        <input
          type="text"
          placeholder="Votre prénom (optionnel)"
          className="border border-slate-300 rounded-lg px-3 py-2 w-full"
          value={name} onChange={e=>setName(e.target.value)}
        />
        <button onClick={save} disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
      {message && <div className="text-sm text-green-700 mt-2">{message}</div>}
      {error && <div className="text-sm text-red-700 mt-2">{error}</div>}
      <p className="text-[11px] text-slate-500 mt-3">Vos données sont utilisées pour personnaliser votre espace et vos contenus éducatifs. Vous pouvez supprimer votre profil à tout moment.</p>
    </div>
  );
}
