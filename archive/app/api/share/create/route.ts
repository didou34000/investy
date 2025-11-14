import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
// import { supabase } from "@/lib/supabase"; // Commenté pour simulation

export async function POST(req: Request) {
  const { email, quiz_result_id } = await req.json();
  if (!email) return NextResponse.json({ error: "missing email" }, { status: 400 });

  // Simulation de génération de token
  const token = randomBytes(24).toString("base64url");
  const expires_at = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

  console.log('🔗 Token de partage créé:', { token, email, expires_at });

  // Simulation de stockage (remplacer par Supabase en production)
  return NextResponse.json({ 
    token,
    note: 'Simulation - Supabase configuration needed'
  });
}
