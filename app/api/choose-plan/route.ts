import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";

const Body = z.object({
  plan_code: z.enum(["free", "standard", "pro"]),
});

export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { plan_code } = parsed.data;

  // Vérifier que le plan existe
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("code")
    .eq("code", plan_code)
    .maybeSingle();

  if (planError || !plan) {
    return NextResponse.json(
      { error: `Plan '${plan_code}' not found` },
      { status: 404 }
    );
  }

  // Upsert dans user_plans (insert ou update si existe déjà)
  const { data, error } = await supabase
    .from("user_plans")
    .upsert(
      {
        user_id: user.id,
        plan_code: plan_code,
        started_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user_plan: data });
}

