import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { thresholdsFor, hit, getCategory, generateAlertMessage } from "@/lib/alertPolicy";
import { fetchYahooBatch, fetchCoingecko } from "@/lib/marketLive";
import { emailTemplate } from "@/lib/emailTemplate";

// Variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

export const dynamic = "force-dynamic";

function todayUTC(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  // Vérification des variables d'environnement
  if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
    return NextResponse.json({
      ok: false,
      error: "Missing environment variables",
      required: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY"],
      message: "Please configure your environment variables in .env.local"
    }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const resend = new Resend(resendApiKey);

  const { searchParams } = new URL(req.url);
  const freq = (searchParams.get("freq") as "daily" | "weekly") || "weekly";
  const origin = `${process.env.NEXT_PUBLIC_BASE_URL || "https://investy.app"}`;
  const idKey = `${freq}:${todayUTC()}`;

  console.log(`[CRON] Starting ${freq} alert run with idempotency key: ${idKey}`);

  // Idempotency check
  const { data: existing } = await supabase
    .from("alert_runs")
    .select("id,status")
    .eq("idempotency_key", idKey)
    .maybeSingle();
  
  if (existing) {
    console.log(`[CRON] Run already exists: ${existing.id} (${existing.status})`);
    return NextResponse.json(
      { ok: false, reason: "already_ran", run_id: existing.id },
      { status: 409 }
    );
  }

  // Create new run
  const { data: runRow, error: runErr } = await supabase
    .from("alert_runs")
    .insert({ idempotency_key: idKey, freq, status: "running" })
    .select("*")
    .single();
  
  if (runErr) {
    console.error(`[CRON] Error creating run:`, runErr);
    return NextResponse.json({ ok: false, error: runErr.message }, { status: 500 });
  }

  let processed = 0;
  let errors: string[] = [];

  try {
    // Get users with alert preferences
    const { data: prefs, error: prefErr } = await supabase
      .from("alerts_settings")
      .select(`
        user_id,
        frequency,
        topics,
        users:users_public(email, name, profile_type),
        unsub:email_unsubscribe(token)
      `)
      .neq("user_id", null);
    
    if (prefErr) throw prefErr;

    console.log(`[CRON] Found ${(prefs || []).length} users with alert preferences`);

    for (const p of prefs || []) {
      try {
        // Skip if no topics configured
        if (!p.topics || p.topics.length === 0) {
          console.log(`[CRON] Skipping user ${p.user_id} - no topics`);
          processed++;
          continue;
        }

        const uid = p.user_id;
        const email = p.users?.email;
        const profile = p.users?.profile_type || "Équilibré";
        const profileTh = thresholdsFor(profile);

        if (!email) {
          console.log(`[CRON] Skipping user ${uid} - no email`);
          processed++;
          continue;
        }

        // Get user's watchlist
        const { data: wl } = await supabase
          .from("user_watchlist")
          .select("symbol, label, category, alert_threshold")
          .eq("user_id", uid);
        
        const entries = wl || [];
        if (entries.length === 0) {
          console.log(`[CRON] User ${uid} has no watchlist items`);
          processed++;
          continue;
        }

        // Fetch quotes
        const ySyms = entries.filter(e => e.category !== "crypto").map(e => e.symbol);
        const cIds = entries.filter(e => e.category === "crypto").map(e => e.symbol);

        const [yQ, cQ] = await Promise.all([
          fetchYahooBatch(ySyms),
          fetchCoingecko(cIds)
        ]);

        const qMap: Record<string, any> = {};
        for (const q of [...yQ, ...cQ]) {
          qMap[q.symbol] = q;
        }

        // Build alert items based on thresholds
        const items = entries
          .map(e => {
            const q = qMap[e.symbol];
            const d1 = q?.change1dPct ?? null;
            const d5 = q?.change5dPct ?? null;
            const cat = getCategory(e.category);
            const trigger = hit(
              d1 == null ? null : Math.abs(d1),
              cat,
              profileTh,
              e.alert_threshold as any || null
            );

            if (trigger) {
              return {
                symbol: e.symbol,
                label: e.label,
                category: e.category,
                change1d: d1,
                change5d: d5,
                message: generateAlertMessage(e.symbol, e.category, d1, d5),
                severity: "watch"
              };
            }
            return null;
          })
          .filter(Boolean);

        // Log event
        const { data: ev } = await supabase
          .from("alert_events")
          .insert({
            run_id: runRow.id,
            user_id: uid,
            email,
            profile_type: profile,
            frequency: p.frequency,
            items,
            sent: false
          })
          .select("*")
          .single();

        // Send email if items or if weekly (send summary even without items)
        if (items.length > 0 || freq === "weekly") {
          const unsubToken = Array.isArray(p.unsub) && p.unsub.length > 0 
            ? p.unsub[0]?.token 
            : undefined;
          
          const html = emailTemplate({
            userName: p.users?.name,
            profile,
            freq,
            items,
            origin,
            unsubToken
          });

          await resend.emails.send({
            from: "Investy <noreply@investy.ai>",
            to: email,
            subject: `📈 Investy — ${freq === "daily" ? "Alerte du jour" : "Résumé de la semaine"}`,
            html
          });

          await supabase
            .from("alert_events")
            .update({ sent: true })
            .eq("id", ev?.id);

          console.log(`[CRON] Email sent to ${email} with ${items.length} items`);
        } else {
          console.log(`[CRON] No email sent to ${email} - no items and not weekly`);
        }

        processed++;
        
        // Throttle to avoid overwhelming APIs
        await new Promise(r => setTimeout(r, 300));
        
      } catch (userError: any) {
        console.error(`[CRON] Error processing user ${p.user_id}:`, userError);
        errors.push(`User ${p.user_id}: ${userError.message}`);
        processed++;
      }
    }

    // Update run status
    await supabase
      .from("alert_runs")
      .update({
        status: "ok",
        finished_at: new Date().toISOString(),
        processed_count: processed
      })
      .eq("id", runRow.id);

    console.log(`[CRON] Run completed successfully: ${processed} users processed`);
    
    return NextResponse.json({
      ok: true,
      run_id: runRow.id,
      processed,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (e: any) {
    console.error(`[CRON] Run failed:`, e);
    
    await supabase
      .from("alert_runs")
      .update({
        status: "error",
        finished_at: new Date().toISOString(),
        error: e?.message || "run_error",
        processed_count: processed
      })
      .eq("id", runRow.id);

    return NextResponse.json(
      { ok: false, run_id: runRow.id, error: e?.message || "run_error" },
      { status: 500 }
    );
  }
}
