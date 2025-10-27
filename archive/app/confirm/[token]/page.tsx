"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { track } from "@/lib/analytics";

export default function ConfirmPage() {
  const { token } = useParams() as { token: string };
  const router = useRouter();
  const [state, setState] = useState<"loading" | "ok" | "bad">("loading");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("email_confirm")
          .select("*")
          .eq("token", token)
          .maybeSingle();

        if (error || !data) {
          console.error("Token not found:", error);
          return setState("bad");
        }

        if (data.confirmed) {
          console.log("Email already confirmed");
          setState("ok");
          setTimeout(() => router.push("/dashboard?confirmed=1"), 1200);
          return;
        }

        const { error: e2 } = await supabase
          .from("email_confirm")
          .update({ confirmed: true })
          .eq("token", token);

        if (e2) {
          console.error("Update error:", e2);
          return setState("bad");
        }

        track("email_confirmed", { user_id: data.user_id });
        setState("ok");
        setTimeout(() => router.push("/dashboard?confirmed=1"), 1200);

      } catch (error) {
        console.error("Confirmation error:", error);
        setState("bad");
      }
    })();
  }, [token, router]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="max-w-md mx-auto p-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          {state === "loading" && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Confirmation en cours...</h2>
              <p className="text-slate-600">Vérification de votre lien de confirmation</p>
            </>
          )}

          {state === "ok" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">Email confirmé !</h2>
              <p className="text-green-700 mb-4">
                Votre adresse email a été confirmée avec succès. Vous allez être redirigé vers votre dashboard.
              </p>
              <div className="text-sm text-slate-600">
                Redirection en cours...
              </div>
            </>
          )}

          {state === "bad" && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-600 text-2xl">✗</span>
              </div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Lien invalide</h2>
              <p className="text-red-700 mb-4">
                Ce lien de confirmation est invalide ou a expiré.
              </p>
              <div className="space-y-3">
                <a 
                  href="/dashboard" 
                  className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Aller au dashboard
                </a>
                <a 
                  href="/quiz" 
                  className="block w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Refaire le quiz
                </a>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Investy — Outil éducatif, non prescriptif
          </p>
        </div>
      </div>
    </main>
  );
}
