import { NextResponse } from "next/server";
import { calculateScore } from "@/lib/quiz-questions";
import { getProfileByScore } from "@/lib/quiz-profiles";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, answers, monthly = 200, horizon = 10 } = body;
    
    if (!email || !answers) {
      return NextResponse.json({ error: "missing" }, { status: 400 });
    }

    // Calcul du score avec le nouveau système
    const score = calculateScore(answers);
    const profile = getProfileByScore(score);
    
    // Calcul de la projection avec intérêts composés
    const projection = monthly * 12 * horizon * (1 + profile.expectedReturn);

    return NextResponse.json({
      profile: profile.id,
      profileName: profile.name,
      allocation: profile.allocation,
      score,
      projection: Math.round(projection),
      monthly,
      horizon,
      expectedReturn: profile.expectedReturn,
      riskLevel: profile.riskLevel,
      timeHorizon: profile.timeHorizon,
      note: "Simulation - Supabase configuration needed"
    });
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json({ error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}