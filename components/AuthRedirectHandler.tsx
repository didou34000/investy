"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Composant ultra-simple :
// - détecte uniquement le #access_token sur la home (/)
// - laisse Supabase gérer le hash (detectSessionInUrl)
// - essaie plusieurs fois de lire la session
// - redirige vers /dashboard/follow si connecté, sinon vers /auth
// AUCUN sessionStorage, AUCUN aller-retour avec /auth.
export default function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token=")) return;

    const run = async () => {
      try {
        // Laisser Supabase traiter le hash (#access_token)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Nettoyer l'URL (enlever le hash) pour éviter de retraiter le token
        window.history.replaceState(null, "", "/");

        // Essayer plusieurs fois de récupérer la session
        for (let i = 0; i < 8; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            router.replace("/dashboard/follow");
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Si après plusieurs tentatives on n'a toujours pas de session,
        // on envoie simplement l'utilisateur vers /auth (pas de boucle possible)
        router.replace("/auth");
      } catch (e) {
        console.error("AuthRedirectHandler error:", e);
        router.replace("/auth");
      }
    };

    run();
  }, [router]);

  return null;
}
