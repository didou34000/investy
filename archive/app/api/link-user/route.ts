import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabase'; // Commenté pour simulation

export async function POST(req:Request){
  const { email, auth_user_id, name } = await req.json();
  if(!email || !auth_user_id) return NextResponse.json({error:'missing'}, {status:400});

  // Simulation de liaison utilisateur
  const userRow = {
    id: 'simulated-user-' + Date.now(),
    email,
    name,
    auth_user_id,
    created_at: new Date().toISOString()
  };

  console.log('🔗 Liaison utilisateur simulée:', { email, auth_user_id, name });

  return NextResponse.json({ 
    ok: true, 
    user_id: userRow.id,
    note: 'Simulation - Supabase configuration needed'
  });
}
