import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialiser Resend seulement si la clé API est valide
const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key_here' 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const { user_id, email } = await req.json();
    
    if (!user_id || !email) {
      return NextResponse.json({ ok: false, error: "Missing user_id or email" }, { status: 400 });
    }

    const token = randomUUID();
    const base = process.env.NEXT_PUBLIC_BASE_URL || "https://investy.app";
    const url = `${base}/confirm/${token}`;

    // Sauvegarder le token
    const { error: dbError } = await supabase
      .from("email_confirm")
      .upsert({ user_id, token, confirmed: false });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    // Envoyer l'email
    if (resend) {
      const { error: emailError } = await resend.emails.send({
        from: "Investy <noreply@investy.ai>",
        to: email,
        subject: "Confirmez votre adresse email (Investy)",
        html: `
          <div style="max-width:680px;margin:auto;font:14px/1.5 Inter,Arial,sans-serif;color:#0f172a">
            <div style="border:1px solid #e5e7eb;border-radius:16px;overflow:hidden">
              <div style="background:linear-gradient(135deg,#0B1220,#111827);padding:18px 20px;color:#fff">
                <div style="font-weight:700;font-size:16px">Investy</div>
                <div style="opacity:.9;margin-top:4px">Confirmation d'adresse email</div>
              </div>
              <div style="padding:18px 20px;background:#fff">
                <p>Bonjour,</p>
                <p>Pour activer vos alertes personnalisées, veuillez confirmer votre adresse email en cliquant sur le lien ci-dessous :</p>
                <div style="text-align:center;margin:24px 0">
                  <a href="${url}" style="display:inline-block;padding:12px 24px;background:#3b82f6;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">
                    Confirmer mon email
                  </a>
                </div>
                <p style="font-size:12px;color:#6b7280;margin-top:16px;border-top:1px solid #e5e7eb;padding-top:12px">
                  Si le bouton ne fonctionne pas, copiez ce lien : <a href="${url}" style="color:#3b82f6">${url}</a>
                </p>
                <p style="font-size:12px;color:#6b7280;margin-top:8px">
                  Contenu éducatif, non prescriptif. Performances passées ≠ performances futures.
                </p>
              </div>
            </div>
          </div>
        `
      });

      if (emailError) {
        console.error("Email error:", emailError);
        return NextResponse.json({ ok: false, error: "Email sending failed" }, { status: 500 });
      }
    } else {
      console.log(`[SIMULATION] Email de confirmation envoyé à ${email} avec token ${token}`);
    }

    return NextResponse.json({ ok: true, message: "Confirmation email sent" });

  } catch (error: any) {
    console.error("Send confirm error:", error);
    return NextResponse.json({ ok: false, error: error.message || "Unknown error" }, { status: 500 });
  }
}
