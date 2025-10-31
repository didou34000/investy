export const dynamic = "force-dynamic"; // évite l'évaluation au build

import { createClient } from "@supabase/supabase-js";
import { fetchYahooBatch, fetchCoingecko } from "@/lib/marketLive";
import { sendAlertEmail } from "@/lib/alertMailer";
import { NextResponse } from "next/server";

function supabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE");
  }
  return createClient(url, key);
}

export async function GET() {
  const supabase = supabaseServer(); // <-- création DANS le handler
  
  const { data: users } = await supabase.from("auth.users").select("id, email");
  const { data: prefs } = await supabase.from("alert_preferences").select("*");
  const { data: watchlist } = await supabase.from("user_watchlist").select("*");

  for (const u of users || []) {
    const pref = prefs?.find((p:any) => p.user_id === u.id);
    const wl = (watchlist||[]).filter((w:any) => w.user_id === u.id);
    if (!wl?.length) continue;

    const yahoo = wl.filter((x:any) => x.category !== "crypto").map((x:any) => x.symbol);
    const cg = wl.filter((x:any) => x.category === "crypto").map((x:any) => x.symbol);

    const [yData, cData] = await Promise.all([
      fetchYahooBatch(yahoo),
      fetchCoingecko(cg),
    ]);

    const quotes = [...yData, ...cData];
    const triggered: any[] = [];
    const sens = Number(pref?.sensitivity || 3);

    for (const q of quotes) {
      const pct = Number(q.change1dPct || 0);
      if (Math.abs(pct) >= sens) {
        triggered.push({
          symbol: q.symbol,
          change: pct,
          message: pct > 0
            ? `${q.symbol} progresse de ${pct.toFixed(1)}% aujourd'hui 📈`
            : `${q.symbol} recule de ${pct.toFixed(1)}% aujourd'hui 📉`,
        });
      }
    }

    if (triggered.length) {
      try{
        await sendAlertEmail({
          email: u.email,
          name: (u.email||"").split("@")[0],
          alerts: triggered,
          macro: ["global", "tech", "inflation"].slice(0, 2),
        });
      }catch{}

      await supabase.from("alert_history").insert(
        triggered.map((t:any) => ({
          user_id: u.id,
          symbol: t.symbol,
          change: t.change,
          message: t.message,
        }))
      );
    }
  }

  return NextResponse.json({ ok: true });
}


