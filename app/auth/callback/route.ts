import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const plan = url.searchParams.get("plan") || "free";

  if (code) {
    const supabase = createServerComponentClient({ cookies });
    // Échange le code contre une session et pose le cookie
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error || !session?.user) {
      // Erreur d'authentification → rediriger vers auth
      return NextResponse.redirect(new URL("/auth", url.origin));
    }

    // Assigner le plan directement (pas besoin de fetch interne)
    try {
      // Vérifier que le plan existe
      const { data: planData } = await supabase
        .from("plans")
        .select("code")
        .eq("code", plan)
        .maybeSingle();

      if (planData) {
        // Upsert dans user_plans
        await supabase
          .from("user_plans")
          .upsert(
            {
              user_id: session.user.id,
              plan_code: plan,
              started_at: new Date().toISOString(),
            },
            {
              onConflict: "user_id",
            }
          );
      }
    } catch (e) {
      console.error("Failed to assign plan:", e);
      // Continue quand même, le trigger SQL peut assigner le plan par défaut
    }
  }

  // Rediriger vers le dashboard après connexion
  return NextResponse.redirect(new URL("/dashboard/follow", url.origin));
}

