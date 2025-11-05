import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = createServerComponentClient({ cookies });
    // Échange le code contre une session et pose le cookie
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Récupérer le plan depuis l'URL pour la redirection
  const plan = url.searchParams.get("plan") || "free";

  // Après login: rediriger vers la page de callback (page.tsx) qui assignera le plan
  return NextResponse.redirect(new URL(`/auth/callback?plan=${plan}`, url.origin));
}

