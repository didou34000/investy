import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }

  requestUrl.searchParams.delete("code");
  // Si c'est un lien de récupération, on envoie vers l'écran de nouveau mot de passe
  if (type === "recovery") {
    return NextResponse.redirect(requestUrl.origin + "/auth/reset");
  }

  return NextResponse.redirect(requestUrl.origin + "/");
}

