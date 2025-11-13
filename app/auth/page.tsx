"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Status = "checking" | "idle" | "loading" | "sent" | "error";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan"); // ex: free, standard, pro

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);

  // 🔹 Étape 1 : vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // Vérifier la session côté client
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        // pas connecté → on montre le formulaire
        if (mounted) {
          setStatus("idle");
        }
        return;
      }

      // Vérifier que la session est valide côté serveur
      try {
        const res = await fetch("/api/subscriptions");
        if (res.status === 401) {
          // Session invalide côté serveur → on montre le formulaire
          if (mounted) {
            setStatus("idle");
          }
          return;
        }

        // Session valide → on peut rediriger
        if (mounted) {
          try {
            // si un plan est passé dans l'URL, on le choisit
            if (plan) {
              await fetch("/api/choose-plan", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  plan_code: plan, // "free", "standard", "pro" etc.
                }),
              });
            }
          } catch (e) {
            console.error("Erreur sur /api/choose-plan :", e);
            // on ne bloque pas pour autant
          }

          // une fois le plan assigné (ou pas), on va sur le dashboard
          router.replace("/dashboard/follow");
        }
      } catch (e) {
        console.error("Erreur vérification session serveur :", e);
        if (mounted) {
          setStatus("idle");
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
    // ⚠️ on ne met pas "plan" en dépendance pour éviter de rerun en boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // 🔹 Étape 2 : si on est encore en train de vérifier la session
  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-gray-700">Vérification de la session...</p>
      </div>
    );
  }

  // 🔹 Étape 3 : formulaire d'email (user non connecté)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      // on ne met pas emailRedirectTo → Supabase utilisera le Site URL ( /auth )
    });

    if (error) {
      console.error(error);
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Connexion à Investy
        </h1>

        {status === "sent" ? (
          <div className="p-4 rounded-lg border text-sm">
            📩 Un lien de connexion t'a été envoyé.
            <br />
            Clique dessus dans tes mails pour te connecter.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="toi@exemple.com"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-md px-3 py-2 text-sm font-medium border bg-black text-white disabled:opacity-60"
            >
              {status === "loading" ? "Envoi..." : "Envoyer le lien magique"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
