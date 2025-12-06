export function emailTemplate({
  userName,
  profile,
  freq,
  items,
  origin,
  unsubToken
}: {
  userName?: string;
  profile: string;
  freq: "daily" | "weekly";
  items: any[];
  origin: string;
  unsubToken?: string;
}) {
  const title = `Résumé ${freq === "daily" ? "du jour" : "hebdomadaire"} — profil ${profile}`;
  
  const list = items.length ? `
    <ul style="padding-left:16px;margin:0">
      ${items.map((it: any) => `
        <li style="margin:6px 0">
          <b>${it.symbol}</b> — ${it.message}
          ${it.change1d != null ? ` (1j: ${(it.change1d >= 0 ? "+" : "")}${it.change1d.toFixed(2)}%)` : ""}
          ${it.change5d != null ? ` — 5j: ${(it.change5d >= 0 ? "+" : "")}${it.change5d.toFixed(2)}%` : ""}
        </li>
      `).join("")}
    </ul>
  ` : `<p style="color:#6b7280">Aucun mouvement notable selon vos seuils.</p>`;

  const unsub = unsubToken ? 
    `<p style="font-size:12px;color:#6b7280;margin-top:16px;border-top:1px solid #e5e7eb;padding-top:12px">
      Se désabonner: <a href="${origin}/u/${unsubToken}" style="color:#3b82f6">${origin}/u/${unsubToken}</a>
    </p>` : "";

  return `
  <div style="max-width:680px;margin:auto;font:14px/1.5 Inter,Arial,sans-serif;color:#0f172a">
    <div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0B1220,#111827);padding:18px 20px;color:#fff">
        <div style="font-weight:700;font-size:16px">Invsty</div>
        <div style="opacity:.9;margin-top:4px">${title}</div>
      </div>
      <div style="padding:18px 20px;background:#fff">
        <p>Bonjour ${userName || ""},</p>
        <p>Voici votre résumé ${freq === "daily" ? "du jour" : "de la semaine"}, en cohérence avec votre profil <b>${profile}</b>.</p>
        ${list}
        <p style="margin-top:14px;font-size:12px;color:#6b7280">
          Contenu éducatif, non prescriptif. Performances passées ≠ performances futures.
        </p>
        ${unsub}
      </div>
    </div>
  </div>`;
}

/**
 * Template pour les emails de test (plus simple)
 */
export function testEmailTemplate({
  userName,
  profile,
  items,
  origin,
  unsubToken
}: {
  userName?: string;
  profile: string;
  items: any[];
  origin: string;
  unsubToken?: string;
}) {
  const list = items.length ? `
    <ul style="padding-left:16px;margin:0">
      ${items.map((it: any) => `
        <li style="margin:6px 0">
          <b>${it.symbol}</b> — ${it.message}
          ${it.change1d != null ? ` (1j: ${(it.change1d >= 0 ? "+" : "")}${it.change1d.toFixed(2)}%)` : ""}
          ${it.change5d != null ? ` — 5j: ${(it.change5d >= 0 ? "+" : "")}${it.change5d.toFixed(2)}%` : ""}
        </li>
      `).join("")}
    </ul>
  ` : `<p style="color:#6b7280">Aucun actif suivi pour l'instant.</p>`;

  const unsub = unsubToken ? 
    `<p style="font-size:12px;color:#6b7280;margin-top:16px;border-top:1px solid #e5e7eb;padding-top:12px">
      Se désabonner: <a href="${origin}/u/${unsubToken}" style="color:#3b82f6">${origin}/u/${unsubToken}</a>
    </p>` : "";

  return `
  <div style="max-width:680px;margin:auto;font:14px/1.5 Inter,Arial,sans-serif;color:#0f172a">
    <div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#0B1220,#111827);padding:18px 20px;color:#fff">
        <div style="font-weight:700;font-size:16px">Invsty</div>
        <div style="opacity:.9;margin-top:4px">Email de test — profil ${profile}</div>
      </div>
      <div style="padding:18px 20px;background:#fff">
        <p>Bonjour ${userName || ""},</p>
        <p>Voici un aperçu de vos alertes basées sur votre profil <b>${profile}</b>.</p>
        ${list}
        <p style="margin-top:14px;font-size:12px;color:#6b7280">
          Contenu éducatif, non prescriptif. Performances passées ≠ performances futures.
        </p>
        ${unsub}
      </div>
    </div>
  </div>`;
}
