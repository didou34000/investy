'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignInPage(){
  const [email,setEmail] = useState('');
  const [status,setStatus] = useState<string|null>(null);

  async function sendMagicLink(e:any){
    e.preventDefault();
    setStatus('Envoi du lien…');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{ emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/dashboard` }
    });
    setStatus(error ? `Erreur: ${error.message}` : 'Lien envoyé. Vérifie ta boîte mail.');
  }

  return (
    <main className="container mx-auto py-12 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Créer mon espace Investy</h1>
      <p className="text-sm text-slate-600 mb-6">Recevez un lien magique par email pour vous connecter.</p>
      <form onSubmit={sendMagicLink} className="space-y-3">
        <input className="border rounded px-4 py-2 w-full" type="email" placeholder="Votre email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <button className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700">Recevoir le lien</button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </main>
  );
}
