import { NextRequest, NextResponse } from "next/server";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

export async function POST(req: NextRequest) {
  const token = req.cookies.get("invsty_token")?.value;
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());

    // Supprimer le UserProfile
    await fetch(`${BASE44_API}/entities/UserProfile/${decoded.id}`, {
      method: "DELETE",
      headers: { "api_key": process.env.BASE44_API_KEY || "" },
    });

    // Effacer le cookie
    const response = NextResponse.json({ ok: true });
    response.cookies.delete("invsty_token");
    return response;
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
