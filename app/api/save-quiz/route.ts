import { NextRequest, NextResponse } from 'next/server';

const BASE44_APP_ID = "69cea6fecb8cd04fd0b6ab59";
const BASE44_API = `https://api.base44.com/api/apps/${BASE44_APP_ID}`;

export async function POST(req: NextRequest) {
  try {
    const { result, answers } = await req.json();

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": process.env.BASE44_API_KEY || "",
    };

    const record = {
      profile_code: result.code,
      profile_label: result.label,
      horizon: result.horizon,
      expected_return: result.expectedReturn,
      expected_vol: result.expectedVol,
      risk_index: result.riskIndex,
      answers: JSON.stringify(answers),
      allocation: JSON.stringify(result.allocation),
    };

    const res = await fetch(`${BASE44_API}/entities/QuizResult`, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Base44 error:", err);
      return NextResponse.json({ ok: false, error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ ok: true, id: data.id });
  } catch (error: any) {
    console.error("Save quiz error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
