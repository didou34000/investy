import { createClient } from "@supabase/supabase-js";
import { advanceFrom } from "@/lib/subscription";
import { sendDigestEmail } from "@/lib/notify";

type Digest = {
  symbol: string;
  date: string;
  signal: any;
  last_price: number | null;
  news: any[];
};

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY)!;
const BOT_API_URL = process.env.BOT_API_URL!;
const BOT_API_KEY = process.env.BOT_API_KEY!;

export async function runSingleSubscription(sub: any, { trigger }: { trigger: "manual" | "scheduled" }) {
  const sb = createClient(URL, KEY);
  try {
    if (!sub.enabled) return { status: "skipped", reason: "disabled" } as const;

    // 1) Bot
    const r = await fetch(BOT_API_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": BOT_API_KEY },
      body: JSON.stringify({ symbol: sub.symbol }),
    });
    if (!r.ok) throw new Error(`Bot HTTP ${r.status}`);
    const verdict = await r.json();

    // 2) Destinataire
    const u = await sb.auth.admin.getUserById(sub.user_id);
    const to = (u.data?.user?.email || "").toString();
    if (!to) throw new Error("user_email_not_found");

    // 3) Email
    const subject = `${sub.symbol} — Signal ${verdict.verdict} (${Math.round((verdict.conviction ?? 0) * 100)}%)`;
    const digest: Digest = {
      symbol: sub.symbol,
      date: new Date().toISOString(),
      signal: verdict,
      last_price: verdict?.last_price ?? null,
      news: verdict?.news ?? [],
    };
    await sendDigestEmail({ to, subject, digest });

    // 4) Prochain run
    const next_run_at = sub.next_run_at
      ? advanceFrom(new Date(sub.next_run_at), sub.frequency, sub.timezone, sub.send_hour, sub.send_minute)
      : new Date(Date.now() + 24 * 3600 * 1000);

    await sb
      .from("subscriptions")
      .update({
        last_run_at: new Date().toISOString(),
        last_status: "sent",
        last_error: null,
        next_run_at,
      })
      .eq("id", sub.id);

    await sb.from("deliveries").insert({
      subscription_id: sub.id,
      user_id: sub.user_id,
      symbol: sub.symbol,
      status: "sent",
      meta: { trigger },
    });

    return { status: "sent", next_run_at } as const;
  } catch (e: any) {
    await sb
      .from("subscriptions")
      .update({
        last_run_at: new Date().toISOString(),
        last_status: "error",
        last_error: String(e?.message ?? e),
      })
      .eq("id", sub.id);

    await sb.from("deliveries").insert({
      subscription_id: sub.id,
      user_id: sub.user_id,
      symbol: sub.symbol,
      status: "error",
      meta: { trigger, error: String(e?.message ?? e) },
    });

    return { status: "error", error: String(e?.message ?? e) } as const;
  }
}


