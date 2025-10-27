'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function SignOut(){
  useEffect(()=>{ supabase.auth.signOut().then(()=>window.location.href='/'); },[]);
  return <div className="p-8">Déconnexion…</div>;
}
