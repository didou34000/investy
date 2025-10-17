"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProgressCrypto from "@/components/quiz/ProgressCrypto";
import OptionCard from "@/components/quiz/OptionCard";
// Fonction simple pour calculer le score à partir des réponses
function calculateScore(answers: Record<string, string>): number {
  let score = 0;
  let totalQuestions = 0;

  // Mapping des réponses vers des scores
  const scoreMap: Record<string, Record<string, number>> = {
    drawdown_max: { "5%": 10, "10%": 25, "20%": 50, "40%": 80 },
    horizon_years: { "1-3": 20, "3-7": 40, "7-15": 60, "15+": 80 },
    wealth_share: { "10%": 15, "25%": 35, "50%": 60, "75%": 85 },
    pref_return: { "3%": 15, "5%": 35, "8%": 60, "12%": 85 },
    asset_interest: { "Obligations": 10, "ETF Monde": 40, "Actions": 70, "Crypto": 90 },
    monthly_investment: { "100": 20, "500": 40, "1000": 60, "2000": 80 },
    reaction_drop: { "1": 10, "2": 30, "3": 60, "4": 85 },
    follow_intensity: { "1": 20, "2": 40, "3": 60, "4": 80 },
    reinvest: { "false": 30, "true": 70 }
  };

  // Calcul du score moyen
  for (const [questionId, answer] of Object.entries(answers)) {
    if (scoreMap[questionId] && scoreMap[questionId][answer] !== undefined) {
      score += scoreMap[questionId][answer];
      totalQuestions++;
    }
  }

  return totalQuestions > 0 ? Math.round(score / totalQuestions) : 50;
}

type Question = {
  id: string;
  title: string;
  help?: string;
  options: { key: string; label: string; note?: string }[];
};

const QUESTIONS: Question[] = [
  {
    id: "drawdown_max",
    title: "Quelle perte annuelle maximale seriez-vous prêt à supporter ?",
    help: "Votre tolérance aux pertes",
    options: [
      { key:"5%",  label:"5%",  note:"Très conservateur" },
      { key:"10%", label:"10%", note:"Conservateur" },
      { key:"20%", label:"20%", note:"Modéré" },
      { key:"40%", label:"40%", note:"Agressif" },
    ]
  },
  {
    id: "horizon_years",
    title: "Quel est votre horizon d'investissement ?",
    help: "Durée de placement",
    options: [
      { key:"1-3", label:"1-3 ans", note:"Court terme" },
      { key:"3-7", label:"3-7 ans", note:"Moyen terme" },
      { key:"7-15", label:"7-15 ans", note:"Long terme" },
      { key:"15+", label:"15+ ans", note:"Très long terme" },
    ]
  },
  {
    id: "wealth_share",
    title: "Quelle part de votre épargne souhaitez-vous investir ?",
    help: "Pourcentage de votre patrimoine",
    options: [
      { key:"10%", label:"Moins de 10%", note:"Très prudent" },
      { key:"25%", label:"10-25%", note:"Prudent" },
      { key:"50%", label:"25-50%", note:"Équilibré" },
      { key:"75%", label:"50-75%", note:"Dynamique" },
    ]
  },
  {
    id: "pref_return",
    title: "Quel rendement annuel visez-vous ?",
    help: "Objectif de performance",
    options: [
      { key:"3%", label:"3-4%", note:"Conservateur" },
      { key:"5%", label:"4-6%", note:"Modéré" },
      { key:"8%", label:"6-10%", note:"Dynamique" },
      { key:"12%", label:"10%+", note:"Agressif" },
    ]
  },
  {
    id: "asset_interest",
    title: "Quels actifs vous intéressent le plus ?",
    help: "Préférences d'investissement",
    options: [
      { key:"Obligations", label:"Obligations", note:"Sécurité" },
      { key:"ETF Monde", label:"ETF Monde", note:"Diversification" },
      { key:"Actions", label:"Actions", note:"Croissance" },
      { key:"Crypto", label:"Crypto", note:"Innovation" },
    ]
  },
  {
    id: "monthly_investment",
    title: "Combien pouvez-vous investir par mois ?",
    help: "Épargne mensuelle",
    options: [
      { key:"100", label:"100-300€", note:"Débutant" },
      { key:"500", label:"300-700€", note:"Intermédiaire" },
      { key:"1000", label:"700-1500€", note:"Confirmé" },
      { key:"2000", label:"1500€+", note:"Expert" },
    ]
  },
  {
    id: "reaction_drop",
    title: "Si votre portefeuille perd 15% en un mois ?",
    help: "Réaction face aux pertes",
    options: [
      { key:"1", label:"Je vends tout", note:"Très prudent" },
      { key:"2", label:"Je vends une partie", note:"Prudent" },
      { key:"3", label:"Je garde", note:"Équilibré" },
      { key:"4", label:"J'achète plus", note:"Dynamique" },
    ]
  },
  {
    id: "follow_intensity",
    title: "À quelle fréquence suivez-vous les marchés ?",
    help: "Intensité de suivi",
    options: [
      { key:"1", label:"Jamais", note:"Passif" },
      { key:"2", label:"Mensuel", note:"Occasionnel" },
      { key:"3", label:"Hebdomadaire", note:"Régulier" },
      { key:"4", label:"Quotidien", note:"Actif" },
    ]
  },
  {
    id: "reinvest",
    title: "Souhaitez-vous réinvestir automatiquement vos gains ?",
    help: "Stratégie de réinvestissement",
    options: [
      { key:"false", label:"Non", note:"Retirer les gains" },
      { key:"true", label:"Oui", note:"Intérêts composés" },
    ]
  }
];

export default function QuizPage(){
  const [step, setStep] = useState(0);
  const total = QUESTIONS.length;
  const progress = step / total;
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const q = QUESTIONS[step];

  function selectAnswer(key: string){
    setAnswers(prev => ({ ...prev, [q.id]: key }));
  }

  function next(){
    if(step < total-1) {
      setStep(step+1);
    } else {
      try {
        // Calculer le score à partir des réponses
        const riskScore = calculateScore(answers);
        
        // Récupérer le montant mensuel de la dernière question
        const monthlyAmount = parseInt(answers.monthly_investment || "200");
        
        // Créer le résultat
        const result = {
          riskIndex: riskScore,
          monthly: monthlyAmount,
          answers: answers
        };
        
        console.log('Résultat calculé:', result); // Debug
        
        // Sauvegarder dans sessionStorage
        sessionStorage.setItem('investy_result', JSON.stringify(result));
        
        // Rediriger vers la page de résultat
        router.push('/result');
      } catch (error) {
        console.error('Erreur lors du calcul du profil:', error);
        alert('Erreur lors du calcul de votre profil. Veuillez réessayer.');
      }
    }
  }

  function prev(){
    if(step > 0) setStep(step-1);
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        {/* Progress courbe */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-6 shadow-lg">
          <ProgressCrypto progress={progress}/>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-[12px] text-slate-500">{q.help}</div>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1 text-slate-900">{q.title}</h1>
          </div>

          <div className="space-y-3">
            {q.options.map((o, idx)=>(
              <OptionCard
                key={o.key}
                index={idx+1}
                label={o.label}
                sublabel={o.note}
                selected={answers[q.id]===o.key}
                onSelect={()=>selectAnswer(o.key)}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={next}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!answers[q.id]}
            >
              {step < total-1 ? 'Continuer' : 'Voir mes résultats'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}