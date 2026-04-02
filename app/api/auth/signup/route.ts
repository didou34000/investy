import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "invsty2025").digest("hex");
}

export async function POST(req: NextRequest) {
  const { email, password, full_name } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  // Vérifier si l'email existe déjà
  const checkRes = await fetch(
    `${BASE44_API}/entities/UserProfile?email=${encodeURIComponent(email)}`,
    { headers: { "api_key": process.env.BASE44_API_KEY || "" } }
  );
  const existing = await checkRes.json();
  if (Array.isArray(existing) && existing.find((u: any) => u.email === email)) {
    return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
  }

  // Créer le compte
  const hash = hashPassword(password);
  const createRes = await fetch(`${BASE44_API}/entities/UserProfile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api_key": process.env.BASE44_API_KEY || "",
    },
    body: JSON.stringify({
      email,
      full_name: full_name || "",
      plan: "free",
      password_hash: hash,
      subscribed_to_newsletter: false,
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    return NextResponse.json({ error: "Erreur création compte" }, { status: 500 });
  }

  const user = await createRes.json();
  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, ts: Date.now() })).toString("base64");

  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, plan: user.plan } });
  response.cookies.set("invsty_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}
