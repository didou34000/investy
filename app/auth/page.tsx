"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Status = "checking" | "idle" | "loading" | "sent" | "error";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);

  // 1) Au chargement, on regarde s'il existe déjà une session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        // Si déjà connecté -> dashboard
        router.replace("/dashboard/follow");
      } else {
        // Sinon on affiche le formulaire
        setStatus("idle");
      }
    };

    checkSession();
  }, [router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-gray-700">Vérification de la session...</p>
      </div>
    );
  }

  // 2) Formulaire pour envoyer le lien magique
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      // pas de emailRedirectTo -> Supabase utilisera le Site URL (/auth)
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
