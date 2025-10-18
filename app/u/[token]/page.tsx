"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UnsubPage(){
  const params = useParams() as { token:string };
  const [ok,setOk]=useState<boolean|null>(null);

  useEffect(()=>{ 
    (async ()=>{
      try {
        const { data, error } = await supabase
          .from("email_unsubscribe")
          .select("*")
          .eq("token", params.token)
          .maybeSingle();
        
        if(error || !data){ 
          setOk(false); 
          return; 
        }
        
        // Désactiver les alertes de l'utilisateur
        const { error: e2 } = await supabase
          .from("alerts_settings")
          .update({ topics: [], frequency: "weekly" })
          .eq("user_id", data.user_id);
        
        setOk(!e2);
      } catch (error) {
        console.error("Erreur désinscription:", error);
        setOk(false);
      }
    })(); 
  },[params.token]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <section className="p-10 max-w-xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
        {ok===null && (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="text-slate-600">Chargement…</div>
          </div>
        )}
        
        {ok===true && (
          <div className="text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-semibold text-green-700 mb-2">Désinscription confirmée</h1>
            <p className="text-slate-600 mb-4">
              Vous êtes désinscrit des emails d'alertes. Vous pourrez réactiver depuis votre dashboard.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aller au dashboard
            </a>
          </div>
        )}
        
        {ok===false && (
          <div className="text-center">
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <h1 className="text-2xl font-semibold text-red-700 mb-2">Lien invalide</h1>
            <p className="text-slate-600 mb-4">
              Ce lien de désinscription est invalide ou a expiré.
            </p>
            <a 
              href="/dashboard" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Aller au dashboard
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
