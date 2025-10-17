export type Bucket = "equity"|"bond"|"alts"|"cash";
export type Assumption = { ret:number; vol:number };

export const BASE: Record<Bucket,Assumption> = {
  equity: { ret: 7.5, vol: 18 },
  bond:   { ret: 3.0, vol: 6  },
  alts:   { ret: 6.0, vol: 15 },
  cash:   { ret: 1.5, vol: 0.5}
};

export type Position = {
  bucket: Bucket; weight: number; expected_return?: number; expected_vol?: number;
};

// composition pondérée (variance simplifiée, corrélation moyenne)
export function mixStats(positions: Position[], corr=0.25){
  const w = positions.map(p=>p.weight/100);
  const rets = positions.map(p=> (p.expected_return ?? BASE[p.bucket].ret)/100);
  const vols = positions.map(p=> (p.expected_vol ?? BASE[p.bucket].vol)/100);

  const exp = w.reduce((s,wi,i)=> s + wi*rets[i], 0);
  let varTot = 0;
  for(let i=0;i<w.length;i++){
    for(let j=0;j<w.length;j++){
      const corr_ij = i===j?1:corr;
      varTot += w[i]*w[j]*vols[i]*vols[j]*corr_ij;
    }
  }
  const vol = Math.sqrt(varTot);
  const worstYear = -2*vol*100;
  const maxDD = 2.5*vol*100;
  return { expPct: exp*100, volPct: vol*100, worstYear, maxDD };
}

// simulation DCA/retrait
export function simulate({
  years, monthly, reinvest=true, shockPct=0, annualReturnPct=6.0, monthlyWithdraw=0
}:{
  years:number; monthly:number; reinvest?:boolean; shockPct?:number; annualReturnPct:number; monthlyWithdraw?:number;
}){
  const r = Math.pow(1+annualReturnPct/100, 1/12)-1;
  let value = 0;
  const points:{t:string,v:number,cum:number}[]=[];
  let cum = 0;
  for(let m=1;m<=years*12;m++){
    value = reinvest ? (value*(1+r)) : value;
    value += monthly;
    value -= monthlyWithdraw;
    if(m===1 && shockPct<0){ value *= (1+shockPct/100); }
    cum += monthly;
    if(m%12===0){
      points.push({ t:`Année ${m/12}`, v: Math.max(value,0), cum });
    }
  }
  return { points, final:value, cum };
}


