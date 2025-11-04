import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getUserPlan, countUserActiveSubs } from "@/lib/plans";
import { computeNextRunUTC } from "@/lib/subscription";
import { z } from "zod";

const Body = z.object({
  symbol: z.string().min(1),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  timezone: z.string().default("Europe/Paris"),
  send_hour: z.number().int().min(0).max(23).default(8),
  send_minute: z.number().int().min(0).max(59).default(0),
});

export async function GET() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscriptions: data ?? [] });
}

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

  const { symbol, frequency, timezone, send_hour, send_minute } = parsed.data;

  // Vérifier le quota du plan
  const plan = await getUserPlan(user.id);
  const activeCount = await countUserActiveSubs(user.id);

  if (activeCount >= plan.max_assets) {
    return NextResponse.json(
      { error: `quota reached: max_assets=${plan.max_assets}` },
      { status: 403 }
    );
  }

  // Calculer la prochaine date d'exécution
  const next_run_at = computeNextRunUTC(frequency, timezone, send_hour, send_minute);

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: user.id,
      symbol,
      frequency,
      timezone,
      send_hour,
      send_minute,
      enabled: true,
      next_run_at,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subscription: data });
}

