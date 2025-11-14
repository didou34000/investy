import { NextResponse } from "next/server";
import { matchArchetype, personalize, Modulators } from "@/lib/profilesCatalog";

export async function POST(req: Request){
  try{
    const body = await req.json();
    const score = Number(body?.score ?? 45);
    const mods  = (body?.mods || {}) as Modulators;

    const archetype = matchArchetype(score);
    const { allocation, suggestions } = personalize(archetype, mods);

    return NextResponse.json({
      ok: true,
      profile: { id: archetype.id, title: archetype.title, score, description: archetype.description },
      allocation,
      suggestions: suggestions.map((s:any) => ({
        symbol: s.symbol, label: s.label, category: s.category,
        suitability: s.suitability, rationale: s.rationale, tilt: s.tilt||[], region: s.region
      })),
      disclaimer: "Contenu éducatif — Investy n’émet pas de recommandations personnalisées. Les allocations et actifs listés sont illustratifs."
    });
  } catch (e:any){
    return NextResponse.json({ ok:false, error: e?.message||"reco_error" }, { status:500 });
  }
}


