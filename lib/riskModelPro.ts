export type QA = { id: string; value: number }; // 1..5 pour Likert; champs chiffrés normalisés à 1..5 avant calcul
export type Axes = { tolerance: number; capacite: number; besoin: number }; // 0..100 chacun
export type RiskOutput = { riskIndex: number; axes: Axes };

function clamp(x:number, a=0, b=100){ return Math.max(a, Math.min(b, x)); }
function normLikert(x:number){ const v=Math.max(1, Math.min(5, x)); return ((v-1)/4)*100; } // 1..5 -> 0..100

/** 
 * computeRiskIndex
 * Entrée: 16 réponses (1..5) dont certaines issues de champs quantitatifs transformés.
 * Sortie: sous-indices + index agrégé (pondère un peu plus la capacité).
 */
export function computeRiskIndex(answers: Record<string, number>): RiskOutput {
  // Pondérations par axe
  const W = {
    // Tolérance (psychologie, réaction aux pertes, constance)
    tol_risk: 2, tol_drawdown: 2, tol_reaction: 2, tol_consistency: 1,
    // Capacité (horizon, stabilité revenu, réserves, concentration patrimoine)
    cap_horizon: 3, cap_income_stability: 2, cap_reserves: 2, cap_wealth_share: 2,
    // Besoin (objectif rendement, besoin de croissance réelle, connaissance produit, flex de versements)
    bes_target: 2, bes_real: 2, bes_knowledge: 1, bes_flex: 1,
    // Scénarios chiffrés
    sc_10_drop: 2, sc_20_drop: 2, sc_recovery_view: 1, sc_liquidity_need: 1,
  };

  // Normalisations
  const T = (id:string) => normLikert(answers[id] ?? 3);

  const tol = clamp(
    (T("tol_risk")*W.tol_risk + T("tol_drawdown")*W.tol_drawdown + T("tol_reaction")*W.tol_reaction + T("tol_consistency")*W.tol_consistency) 
    / (W.tol_risk+W.tol_drawdown+W.tol_reaction+W.tol_consistency)
  );

  let cap = clamp(
    (T("cap_horizon")*W.cap_horizon + T("cap_income_stability")*W.cap_income_stability + T("cap_reserves")*W.cap_reserves + T("cap_wealth_share")*W.cap_wealth_share) 
    / (W.cap_horizon+W.cap_income_stability+W.cap_reserves+W.cap_wealth_share)
  );

  const bes = clamp(
    (T("bes_target")*W.bes_target + T("bes_real")*W.bes_real + T("bes_knowledge")*W.bes_knowledge + T("bes_flex")*W.bes_flex)
    / (W.bes_target+W.bes_real+W.bes_knowledge+W.bes_flex)
  );

  // Scénarios ajustent tol/cap
  const sc_block = (T("sc_10_drop")*W.sc_10_drop + T("sc_20_drop")*W.sc_20_drop + T("sc_recovery_view")*W.sc_recovery_view + T("sc_liquidity_need")*W.sc_liquidity_need)
                 / (W.sc_10_drop+W.sc_20_drop+W.sc_recovery_view+W.sc_liquidity_need);

  // Horizon court et réserves faibles brident la capacité maximale
  if (T("cap_horizon") < 25) cap = Math.min(cap, 35);
  if (T("cap_reserves") < 25) cap = Math.min(cap, 30);

  // Agrégation (capacité pèse un peu plus)
  const riskIndex = clamp( tol*0.35 + cap*0.45 + bes*0.20 + 0.1*(sc_block - 50) );
  return { riskIndex, axes: { tolerance: tol, capacite: cap, besoin: bes } };
}

// Allocation paramétrique continue
export function allocationFromRisk(r:number){
  // bornes de prudence institutionnelles
  const eq = clamp( 15 + 0.75*r, 15, 90 );
  const fi = clamp( 70 - 0.55*r,  5,  75 );
  const alt = clamp( (r>65? (r-65)*0.5 : 0), 0, 20 );
  const cash = clamp( Math.max(0, 12 - 0.08*r), 0, 12 );
  const sum = eq+fi+alt+cash, k = 100/sum;
  return {
    "Actions Monde": Math.round(eq*k),
    "Obligations (Gov/IG)": Math.round(fi*k),
    "Alternatifs": Math.round(alt*k),
    "Liquidités": Math.round(cash*k),
  };
}

export type AssumptionInput = {
  riskIndex: number;         // 0..100
  drawdownTolerancePct: number; // ex. 10..60 (% max que l'utilisateur accepte de voir baisser)
};

/**
 * Hypothèses calibrées en plages réalistes.
 * - À risque faible: ~3–5% de rendement attendu, ~5–10% de vol, DD modéré.
 * - À risque élevé: peut dépasser 12–15% attendu, mais vol 30–45% et drawdowns majeurs.
 * On lie la tolérance de perte déclarée à un plafond de volatilité.
 */
export function assumptionsPro(input: AssumptionInput) {
  const r = Math.max(0, Math.min(100, input.riskIndex));
  // Base (avant contrainte de drawdown)
  let expReturn = 0.025 + (r/100) * 0.125;   // 2.5% → 15.0% (nominal attendu)
  let expVol    = 0.05  + (r/100) * 0.40;    // 5% → 45% (annualisée)

  // Lien simple DD ~ 2 * Vol (ordre de grandeur). On plafonne la vol avec la tolérance déclarée.
  // Exemple: si tolérance = 20% → vol max ≈ 10%.
  const maxVolFromDD = Math.max(0.05, (input.drawdownTolerancePct/2) / 100);
  if (expVol > maxVolFromDD) {
    expVol = maxVolFromDD;
    // si on bride la vol, on réduit aussi l'espérance (ratio 0.65 ~ 0.8)
    const scale = 0.75 + 0.1 * Math.random(); // petit bruit pour éviter linéarité parfaite
    expReturn = Math.min(expReturn, 0.02 + expVol * (1.2*scale + 0.8)); // cap raisonnable cohérent avec vol
  }

  // Garde-fous institutionnels
  expReturn = Math.max(0.015, Math.min(0.18, expReturn)); // 1.5%..18%
  expVol    = Math.max(0.05,  Math.min(0.45, expVol));    // 5%..45%

  // DD attendu approx (indicatif)
  const expDD = Math.min(input.drawdownTolerancePct/100, 2.2*expVol); // borne par tolérance et vol

  return { expReturn, expVol, expDD };
}

/**
 * Projection pédagogique sur "years" années, versements mensuels "monthly".
 * - reinvest=true: capitalise tout (dividendes/gains).
 * - reinvest=false: simule un retrait annuel d'un "rendement distribué" (grossier, à but pédagogique).
 * On renvoie aussi un intervalle P10/P50/P90.
 */
export function projectionPro(
  monthly: number,
  years: number,
  assumptions: { expReturn:number; expVol:number },
  reinvest: boolean
){
  const n = Math.max(1, Math.floor(years)) * 12;
  const mu = assumptions.expReturn/12;
  const sigma = assumptions.expVol/Math.sqrt(12);

  function simulateOne(runReinvest:boolean){
    let bal = 0;
    for (let i=0;i<n;i++){
      // versement
      bal += monthly;
      // rendement (bruité)
      const z = (()=>{ const u=Math.random(), v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); })();
      const rMonth = (mu - 0.5*(sigma**2)) + sigma*z; // approx log-return
      if(runReinvest){
        bal = Math.max(0, bal * Math.exp(rMonth));
      }else{
        // sans réinvestissement: on applique le rendement mais on distribue 60%/an (≈5%/mois) quand positif
        const gross = bal * Math.exp(rMonth);
        const distribution = Math.max(0, gross - bal) * (0.60/12); // part distribuée mensuelle
        bal = Math.max(0, gross - distribution);
      }
    }
    return Math.round(bal);
  }

  const runs = 300;
  const arrRe = Array.from({length:runs}, ()=>simulateOne(true)).sort((a,b)=>a-b);
  const arrNo = Array.from({length:runs}, ()=>simulateOne(false)).sort((a,b)=>a-b);

  const pick = (arr:number[], p:number)=> arr[Math.floor(p*(runs-1))];

  return {
    withReinvest:  { p10: pick(arrRe,0.10), p50: pick(arrRe,0.50), p90: pick(arrRe,0.90) },
    withoutReinvest:{ p10: pick(arrNo,0.10), p50: pick(arrNo,0.50), p90: pick(arrNo,0.90) }
  };
}
