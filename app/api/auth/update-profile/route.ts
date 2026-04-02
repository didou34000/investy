import { NextRequest, NextResponse } from "next/server";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

export async function POST(req: NextRequest) {
  const token = req.cookies.get("invsty_token")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const { full_name } = await req.json();

    const res = await fetch(`${BASE44_API}/entities/UserProfile/${decoded.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "api_key": process.env.BASE44_API_KEY || "",
      },
      body: JSON.stringify({ full_name }),
    });

    if (!res.ok) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });

    // Re-issue token with updated info
    const updated = await res.json();
    const newToken = Buffer.from(JSON.stringify({
      id: decoded.id,
      email: decoded.email,
      full_name: updated.full_name,
      ts: Date.now(),
    })).toString("base64");

    const response = NextResponse.json({ ok: true });
    response.cookies.set("invsty_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
