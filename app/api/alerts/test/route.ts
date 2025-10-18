import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { fetchYahooBatch, fetchCoingecko } from "@/lib/marketLive";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(){
  try{
    const supabase = createServerComponentClient({ cookies });
    const { data:{ session } } = await supabase.auth.getSession();
    if(!session) return NextResponse.json({ ok:false, error:"not_authenticated" }, { status:401 });

    const { data: wl } = await supabase
      .from("user_watchlist")
      .select("symbol,label,category")
      .eq("user_id", session.user.id);
    
    const y = (wl||[]).filter(w=>w.category!=="crypto").map(w=>w.symbol);
    const c = (wl||[]).filter(w=>w.category==="crypto").map(w=>w.symbol);
    const [yq, cq] = await Promise.all([fetchYahooBatch(y), fetchCoingecko(c)]);

    const rows = [...yq, ...cq];
    const lines = rows.map(r => {
      const d1 = r.change1dPct!=null ? `${r.change1dPct>=0?"+":""}${r.change1dPct.toFixed(2)}%` : "—";
      const d5 = r.change5dPct!=null ? `${r.change5dPct>=0?"+":""}${r.change5dPct.toFixed(2)}%` : "—";
      return `<li><b>${r.symbol}</b> : ${d1} (1j) · ${d5} (5j)</li>`;
    }).join("");

    await resend.emails.send({
      from: "Investy <noreply@investy.ai>",
      to: session.user.email!,
      subject: "Investy — Email de test (aperçu alertes)",
      html: `
        <div style="max-width:640px;margin:auto;font:14px/1.5 Inter,Arial">
          <h2>Aperçu de vos alertes</h2>
          <ul>${lines || "<li>Pas d'actifs suivis.</li>"}</ul>
          <p style="color:#6b7280;font-size:12px">
            Contenu éducatif, non prescriptif. Performances passées ≠ futures.
          </p>
        </div>
      `
    });

    return NextResponse.json({ ok:true });
  } catch(e:any){
    console.error("Erreur test email:", e);
    return NextResponse.json({ ok:false, error:e?.message||"send_error" }, { status:500 });
  }
}
