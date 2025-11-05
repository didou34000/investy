"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Disable prerendering to avoid CSR bailout warning
export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Vérifier que l'utilisateur est bien connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setStatus("error");
          setTimeout(() => router.push("/auth"), 2000);
          return;
        }

        // Récupérer le plan_code depuis l'URL (client-only)
        const planCode = typeof window !== 'undefined'
          ? (new URLSearchParams(window.location.search).get("plan") || "free")
          : "free";

        // Assigner le plan via l'API
        const response = await fetch("/api/choose-plan", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ plan_code: planCode }),
        });

        if (!response.ok) {
          console.error("Failed to assign plan:", await response.text());
          // Continue quand même, le plan sera assigné par le trigger SQL si nouveau user
        }

        setStatus("success");
        // Rediriger vers le dashboard après 1 seconde
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (error) {
        console.error("Callback error:", error);
        setStatus("error");
        setTimeout(() => router.push("/auth"), 2000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Finalisation de votre inscription...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-slate-900 font-semibold">Compte créé avec succès !</p>
            <p className="text-slate-600 mt-2">Redirection en cours...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <p className="text-slate-900 font-semibold">Erreur lors de la connexion</p>
            <p className="text-slate-600 mt-2">Redirection vers la page d'authentification...</p>
          </>
        )}
      </div>
    </main>
  );
}

