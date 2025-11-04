import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

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

  // Mettre en pause
  const { error } = await supabase
    .from("subscriptions")
    .update({ enabled: false })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

