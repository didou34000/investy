import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "invsty2025").digest("hex");
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("invsty_token")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const { password } = await req.json();
    if (!password || password.length < 6) return NextResponse.json({ error: "Mot de passe trop court" }, { status: 400 });

    const hash = hashPassword(password);
    const res = await fetch(`${BASE44_API}/entities/UserProfile/${decoded.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.BASE44_API_KEY || "",
      },
      body: JSON.stringify({ password_hash: hash }),
    });

    if (!res.ok) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
