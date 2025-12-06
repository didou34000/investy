import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAlertEmail({ email, name, alerts, macro }: any) {
  const ALLOW = (process.env.EMAIL_ALLOWLIST || "").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
  if (ALLOW.length && !ALLOW.includes((email||"").toLowerCase())){
    console.log("[mailer] suppressed (not in allowlist):", email);
    return;
  }
  const title = `🔔 Vos alertes Invsty`;
  const summary = alerts.map((a:any)=>`<li>${a.message}</li>`).join("");
  const macroSection = macro?.length
    ? `<p style="margin-top:12px;">📰 <b>Tendances macro</b> : ${macro.join(", ")}.</p>`
    : "";

  const html = `
    <div style="font-family:Inter,sans-serif;line-height:1.5;color:#111;max-width:680px;margin:auto">
      <h2 style="color:#3B82F6;">Bonjour ${name},</h2>
      <p>Voici les mouvements récents sur vos actifs suivis :</p>
      <ul>${summary}</ul>
      ${macroSection}
      <p style="margin-top:12px;">🧠 Rappel : ces données sont informatives et éducatives, non prescriptives.</p>
      <hr style="margin:20px 0;"/>
      <p style="font-size:12px;color:#64748B;">Envoyé automatiquement par Invsty • <a href="https://investy.app">investy.app</a></p>
    </div>
  `;
  await resend.emails.send({
    from: "Invsty Alerts <alerts@investy.app>",
    to: email,
    subject: title,
    html,
  });
}


