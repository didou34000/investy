import { NextRequest, NextResponse } from "next/server";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("invsty_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const res = await fetch(`${BASE44_API}/entities/UserProfile/${decoded.id}`, {
      headers: { "api_key": process.env.BASE44_API_KEY || "" },
    });
    if (!res.ok) return NextResponse.json({ user: null }, { status: 401 });
    const user = await res.json();
    return NextResponse.json({ user: { id: user.id, email: user.email, full_name: user.full_name, plan: user.plan } });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
