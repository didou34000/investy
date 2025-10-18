import { Resend } from "resend";
import { getSuggestions } from "./suggestions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWeeklyAlertEmail(user: any, profil: string) {
  try {
    const suggestions = getSuggestions(profil);
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Résumé Investy</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
            .card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .asset-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
            .asset-name { font-weight: 600; font-size: 16px; color: #1F2937; }
            .adaptation { background: #F3F4F6; color: #374151; padding: 4px 8px; border-radius: 6px; font-size: 12px; }
            .metrics { display: flex; gap: 15px; font-size: 14px; color: #6B7280; margin: 10px 0; }
            .description { color: #4B5563; margin: 10px 0; }
            .reason { color: #6B7280; font-style: italic; font-size: 14px; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #F9FAFB; border-radius: 8px; }
            .disclaimer { font-size: 12px; color: #9CA3AF; }
            .btn { display: inline-block; background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📈 Résumé Investy</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Suivi de vos actifs — Profil ${profil}</p>
            </div>
            
            <p>Bonjour ${user.name || "Investisseur"},</p>
            <p>Voici votre mise à jour hebdomadaire pédagogique selon votre profil <strong>${profil}</strong>. Ces suggestions sont à but éducatif uniquement.</p>
            
            <h2 style="color: #1F2937; margin: 30px 0 20px 0;">🎯 Actifs suggérés pour votre profil</h2>
            
            ${suggestions.map(s => `
              <div class="card">
                <div class="asset-header">
                  <div class="asset-name">${s.name} (${s.symbol})</div>
                  <span class="adaptation">${s.adaptation}</span>
                </div>
                <div class="metrics">
                  <span>📊 Type: ${s.type}</span>
                  <span>🌍 Région: ${s.region}</span>
                  <span>📈 Rendement: ${s.rendementMoyen}%</span>
                  <span>⚡ Volatilité: ${s.volatilite}%</span>
                </div>
                <div class="description">${s.description}</div>
                <div class="reason">💡 ${s.raison}</div>
                <a href="${s.lien}" class="btn" target="_blank">Consulter la fiche</a>
              </div>
            `).join("")}
            
            <div class="footer">
              <h3 style="color: #1F2937; margin-bottom: 15px;">📚 Ressources éducatives</h3>
              <p>Pour approfondir vos connaissances en investissement :</p>
              <a href="https://www.justetf.com/fr/find-etf.html" class="btn" target="_blank">Guide ETF</a>
              <a href="https://www.amf-france.org/fr/particuliers/epargne-et-investissement" class="btn" target="_blank">Guide AMF</a>
              
              <div class="disclaimer" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #E5E7EB;">
                <strong>⚠️ Avertissement important :</strong><br>
                Ce contenu est à but éducatif uniquement. Investy n'est pas un conseiller financier.<br>
                Aucune garantie de performance. Investir comporte des risques de perte en capital.<br>
                Consultez un professionnel pour des conseils personnalisés.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: "Investy <noreply@investy.ai>",
      to: user.email,
      subject: `📈 Votre suivi hebdomadaire Investy (${profil})`,
      html,
    });

    console.log(`Email envoyé à ${user.email} pour le profil ${profil}`);
    return { success: true };
  } catch (error) {
    console.error(`Erreur envoi email à ${user.email}:`, error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(user: any, profil: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenue sur Investy</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
            .card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
            .btn { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">🎉 Bienvenue sur Investy !</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre profil : ${profil}</p>
            </div>
            
            <p>Bonjour ${user.name || "Investisseur"},</p>
            <p>Félicitations ! Vous avez complété votre évaluation de profil investisseur.</p>
            
            <div class="card">
              <h2 style="color: #1F2937; margin-top: 0;">🎯 Votre profil : ${profil}</h2>
              <p>Nous avons analysé vos réponses et identifié votre profil d'investisseur. Ce profil nous permet de vous proposer des contenus éducatifs adaptés à votre niveau de risque.</p>
            </div>
            
            <div class="card">
              <h3 style="color: #1F2937;">📚 Ce que vous allez recevoir :</h3>
              <ul>
                <li><strong>Suggestions d'actifs</strong> adaptées à votre profil</li>
                <li><strong>Résumés hebdomadaires</strong> sur l'actualité de vos actifs</li>
                <li><strong>Contenu éducatif</strong> pour approfondir vos connaissances</li>
                <li><strong>Alertes personnalisées</strong> selon vos préférences</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/result" class="btn">Voir mes résultats</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'}/macro" class="btn">Actualités macro</a>
            </div>
            
            <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-top: 30px;">
              <h3 style="color: #1F2937; margin-top: 0;">⚠️ Rappel important</h3>
              <p style="font-size: 14px; color: #6B7280; margin: 0;">
                Investy est un outil éducatif, non un conseiller financier. 
                Aucune garantie de performance. Investir comporte des risques.
                Consultez un professionnel pour des conseils personnalisés.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: "Investy <noreply@investy.ai>",
      to: user.email,
      subject: `🎉 Bienvenue sur Investy - Profil ${profil}`,
      html,
    });

    console.log(`Email de bienvenue envoyé à ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error(`Erreur envoi email de bienvenue à ${user.email}:`, error);
    return { success: false, error };
  }
}
