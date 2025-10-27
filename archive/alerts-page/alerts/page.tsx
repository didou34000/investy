"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AlertsPage() {
  const [freq, setFreq] = useState("weekly");
  const [sens, setSens] = useState(3);
  const [themes, setThemes] = useState<string[]>(["global","tech"]);

  useEffect(() => { load(); }, []);

  async function load(){
    const { data:{ session } } = await supabase.auth.getSession();
    if(!session) return;
    const { data } = await supabase
      .from("alert_preferences")
      .select("*")
      .eq("user_id", session.user.id)
      .maybeSingle();
    if(data){
      setFreq(data.frequency||"weekly");
      setSens(Number(data.sensitivity||3));
      setThemes(data.macro_themes || []);
    }
  }

  async function save(){
    const { data:{ session } } = await supabase.auth.getSession();
    if(!session){ alert("Connectez-vous"); return; }
    await supabase.from("alert_preferences").upsert({
      user_id: session.user.id,
      frequency: freq,
      sensitivity: sens,
      macro_themes: themes,
    });
    alert("Préférences enregistrées ✔");
  }

  function toggleTheme(t:string){
    setThemes(th => th.includes(t) ? th.filter(x=>x!==t) : [...th,t]);
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Mes alertes</h1>
        <p className="text-slate-600 mt-1">Recevez automatiquement un résumé des mouvements importants de vos actifs et des tendances économiques.</p>

        <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="flex flex-col">Fréquence d’envoi
              <select value={freq} onChange={e=>setFreq(e.target.value)} className="mt-1 border rounded-lg px-3 py-2">
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
            </label>

            <label className="flex flex-col">Sensibilité (%)
              <input type="range" min={1} max={10} value={sens} onChange={e=>setSens(Number(e.target.value))}/>
              <div className="text-sm text-slate-500">{sens}% de variation pour alerte</div>
            </label>
          </div>

          <div className="mt-4">
            <div className="font-medium mb-2">Thèmes macro suivis</div>
            <div className="flex flex-wrap gap-2">
              {["global","rates","inflation","tech","energy","crypto"].map(t=>(
                <button key={t} onClick={()=>toggleTheme(t)} className={`px-3 py-1.5 rounded-lg border text-sm ${themes.includes(t)?"bg-blue-600 text-white border-blue-600":"bg-white border-slate-300 hover:bg-slate-50"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button onClick={save} className="mt-6 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Enregistrer</button>
        </div>
      </div>
    </main>
  );
}


