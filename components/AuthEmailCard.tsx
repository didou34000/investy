"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AuthEmailCard({ onSuccess }:{ onSuccess?:()=>void }){
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);
  const [loading, setLoading] = useState(false);
  
  async function send(){
    if (!email) {
      alert("Veuillez entrer votre adresse email");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options:{ 
          emailRedirectTo: `${window.location.origin}/dashboard` 
        }
      });
      
      if(error) {
        alert(error.message);
      } else {
        setSent(true);
        onSuccess?.();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du lien");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm">
      <div className="font-medium text-slate-900">Créer mon espace</div>
      <p className="text-sm text-slate-600 mt-1">
        Recevez un lien sécurisé par email. Pas de mot de passe requis.
      </p>
      
      <div className="mt-3 flex gap-2">
        <input 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          placeholder="email@exemple.com" 
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="email"
          disabled={sent}
        />
        <button 
          onClick={send} 
          disabled={loading || sent}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "..." : sent ? "Envoyé" : "Envoyer"}
        </button>
      </div>
      
      {sent && (
        <div className="text-sm text-green-600 mt-2 flex items-center gap-2">
          <span>✓</span>
          <span>Lien de connexion envoyé à {email}</span>
        </div>
      )}
      
      <p className="text-xs text-slate-500 mt-2">
        Cliquez sur le lien dans votre email pour vous connecter automatiquement.
      </p>
    </div>
  );
}