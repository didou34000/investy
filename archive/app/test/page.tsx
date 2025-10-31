'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState('⏳ Test en cours...');
  useEffect(() => {
    supabase.from('users_public').select('*').limit(1)
      .then(() => setStatus('✅ Connexion Supabase OK'))
      .catch(() => setStatus('❌ Erreur connexion Supabase'));
  }, []);
  return (
    <div className="flex h-screen items-center justify-center bg-white text-slate-800">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Test Supabase</h1>
        <p>{status}</p>
      </div>
    </div>
  );
}
