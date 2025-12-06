import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY || "";
const FROM = process.env.EMAIL_FROM || "Invsty <noreply@investy.ai>";

const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

export async function sendDigestEmail({ to, subject, digest }: { to: string; subject: string; digest: any }) {
  const html = render(digest);

  if (!resend) {
    console.log("📧 [SIMULATION] sendDigestEmail", { to, subject, from: FROM, digest });
    return { success: true, simulated: true } as const;
  }

  await resend.emails.send({ from: FROM, to, subject, html });
  return { success: true } as const;
}

function render(d: any) {
  const pct = d?.signal?.conviction != null ? Math.round(d.signal.conviction * 100) : "—";
  const bullets = (d?.signal?.key_signals ?? [])
    .slice(0, 3)
    .map((s: string) => `<li>${escapeHtml(s)}</li>`)?.join("") ?? "";
  const news = (d?.news ?? [])
    .slice(0, 5)
    .map((n: any) => `<li><a href="${n.url}">${escapeHtml(n.title)}</a></li>`)?.join("") ?? "";

  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;padding:16px">
    <h2 style="margin:0 0 8px 0">${escapeHtml(d.symbol)} — ${escapeHtml(d?.signal?.verdict ?? "—")} (${pct}%)</h2>
    <p style="margin:0 0 8px 0"><b>Horizon:</b> ${d?.signal?.horizon_days ?? "—"} jours</p>
    <p style="margin:0 0 8px 0"><b>Invalidation:</b> ${escapeHtml(d?.signal?.invalidation ?? "—")}</p>
    <p style="margin:12px 0">${escapeHtml(d?.signal?.rationale ?? "")}</p>
    ${bullets ? `<ul>${bullets}</ul>` : ""}
    ${news ? `<h3>Actus récentes</h3><ul>${news}</ul>` : ""}
    <p style="color:#6b7280;font-size:12px;margin-top:16px">Invsty — ajustez votre suivi depuis votre espace.</p>
  </div>`;
}

function escapeHtml(s: string) {
  return s?.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") ?? "";
}


