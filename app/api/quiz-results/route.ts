import { NextRequest, NextResponse } from "next/server";

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://app.base44.com/api/apps/${BASE44_APP_ID}`;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("invsty_token")?.value;
  if (!token) return NextResponse.json([], { status: 401 });

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString());
    const userId = decoded.id;

    const res = await fetch(`${BASE44_API}/entities/QuizResult`, {
      headers: { "api_key": process.env.BASE44_API_KEY || "" },
    });
    if (!res.ok) return NextResponse.json([]);

    const all = await res.json();
    // Filtrer par user (created_by_id)
    const userResults = Array.isArray(all)
      ? all.filter((r: any) => r.created_by_id === userId || r.email === decoded.email)
          .sort((a: any, b: any) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
      : [];

    return NextResponse.json(userResults);
  } catch {
    return NextResponse.json([]);
  }
}
