import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name?: string) {
  const html = `
  <div style="font-family:Inter,sans-serif;line-height:1.6;color:#111;max-width:600px;margin:0 auto;padding:20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#3B82F6;font-size:28px;margin:0;">💼 Investy</h1>
      <p style="color:#64748B;margin:5px 0 0 0;">L'investissement expliqué simplement</p>
    </div>
    
    <h2 style="color:#3B82F6;font-size:24px;margin-bottom:20px;">Bienvenue sur Investy !</h2>
    
    <p style="font-size:16px;margin-bottom:20px;">Bonjour ${name || "cher utilisateur"},</p>
    
    <p style="font-size:16px;margin-bottom:20px;">
      Vous venez de rejoindre la première plateforme éducative qui simplifie l'investissement. 
      Découvrez votre profil investisseur et apprenez à investir intelligemment.
    </p>
    
    <div style="background:#F8FAFC;border-left:4px solid #3B82F6;padding:20px;margin:20px 0;">
      <h3 style="color:#1E293B;margin:0 0 15px 0;font-size:18px;">Vos prochaines étapes :</h3>
      <ul style="margin:0;padding-left:20px;color:#475569;">
        <li style="margin-bottom:8px;">📊 <strong>Découvrez votre profil</strong> avec notre quiz personnalisé</li>
        <li style="margin-bottom:8px;">📈 <strong>Suivez vos actifs</strong> en temps réel sur votre dashboard</li>
        <li style="margin-bottom:8px;">🔔 <strong>Recevez des alertes</strong> importantes selon votre stratégie</li>
        <li style="margin-bottom:8px;">📚 <strong>Apprenez</strong> avec nos contenus éducatifs</li>
      </ul>
    </div>
    
    <div style="text-align:center;margin:30px 0;">
      <a href="https://investy.app/dashboard" 
         style="background:#3B82F6;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">
        Accéder à mon dashboard →
      </a>
    </div>
    
    <div style="border-top:1px solid #E2E8F0;padding-top:20px;margin-top:30px;">
      <p style="font-size:12px;color:#64748B;margin:0;line-height:1.4;">
        <strong>Important :</strong> Investy est une plateforme d'éducation financière, pas un conseiller en investissement agréé. 
        Les contenus sont informatifs et non prescriptifs. Aucune garantie de performance n'est donnée.
      </p>
    </div>
    
    <div style="text-align:center;margin-top:20px;font-size:12px;color:#94A3B8;">
      <p>Investy • Plateforme d'éducation financière</p>
      <p>Pour toute question : <a href="mailto:contact@investy.app" style="color:#3B82F6;">contact@investy.app</a></p>
    </div>
  </div>
  `;

  try {
    await resend.emails.send({
      from: "Investy <hello@investy.app>",
      to: email,
      subject: "Bienvenue sur Investy 💼 - Découvrez votre profil investisseur",
      html
    });
    console.log(`[Welcome Email] Sent to ${email}`);
  } catch (error) {
    console.error("[Welcome Email] Failed:", error);
    throw error;
  }
}
