import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "invsty2025").digest("hex");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Champs manquants" }, { status: 400 });

  const res = await fetch(
    `${BASE44_API}/entities/UserProfile?email=${encodeURIComponent(email)}`,
    { headers: { "api_key": process.env.BASE44_API_KEY || "" } }
  );
  const users = await res.json();
  const user = Array.isArray(users) ? users.find((u: any) => u.email === email) : null;

  if (!user) return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  const hash = hashPassword(password);
  if (user.password_hash !== hash) return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 });

  // Créer un token simple
  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, ts: Date.now() })).toString("base64");

  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, full_name: user.full_name, plan: user.plan } });
  response.cookies.set("invsty_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: "/",
  });
  return response;
}
