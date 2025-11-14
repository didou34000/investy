import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { runSingleSubscription } from "@/jobs/run_single_subscription";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Vérifier que la subscription existe et appartient à l'utilisateur
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!sub || sub.user_id !== user.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  try {
    const result = await runSingleSubscription(sub, { trigger: "manual" });
    return NextResponse.json({ ok: true, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "run_failed" },
      { status: 500 }
    );
  }
}

