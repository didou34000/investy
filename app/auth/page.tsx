"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Status = "checking" | "idle" | "loading" | "sent" | "error";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("checking");
  const [error, setError] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Vérifier si le hash contient un access_token (magic link)
    const hash = window.location.hash;
    const hasAccessToken = hash.includes("access_token=");

    const redirectToDashboard = () => {
      if (hasRedirectedRef.current) return;
      hasRedirectedRef.current = true;
      
      // Nettoyer le hash
      if (hasAccessToken) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      
      // Marquer qu'on vient de rediriger (avec timestamp pour expiration)
      sessionStorage.setItem("auth_redirect_timestamp", Date.now().toString());
      
      router.replace("/dashboard/follow");
    };

    const checkSession = async () => {
      try {
        // Si on a un hash avec access_token, attendre que Supabase le traite
        if (hasAccessToken) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus("idle");
          return;
        }

        const session = data.session;

        // Ne rediriger QUE si on a un token dans le hash OU si on a une session valide
        // ET qu'on n'a pas déjà redirigé récemment (évite les boucles)
        const lastRedirect = sessionStorage.getItem("auth_redirect_timestamp");
        const timeSinceRedirect = lastRedirect ? Date.now() - parseInt(lastRedirect) : Infinity;
        
        if (session && session.user && (hasAccessToken || timeSinceRedirect > 5000)) {
          // Attendre un peu pour s'assurer que la session est bien établie
          await new Promise((resolve) => setTimeout(resolve, 300));
          redirectToDashboard();
        } else {
          setStatus("idle");
        }
      } catch (e) {
        setStatus("idle");
      }
    };

    checkSession();

    // Écouter les changements d'auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session && session.user && !hasRedirectedRef.current) {
        setTimeout(() => {
          redirectToDashboard();
        }, 300);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-gray-700">Vérification de la session...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
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
            Va dans ta boîte mail et clique dessus.
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
