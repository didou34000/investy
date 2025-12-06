"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProgressCrypto from "@/components/quiz/ProgressCrypto";
import { scoreFromAnswers } from "@/lib/profileEnginePro";
import { mapToProfile } from "@/lib/profileMapper";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check, HelpCircle } from "lucide-react";

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
      { key: "5%", label: "5%", note: "Très conservateur" },
      { key: "10%", label: "10%", note: "Conservateur" },
      { key: "20%", label: "20%", note: "Modéré" },
      { key: "40%", label: "40%", note: "Agressif" },
      { key: "UNK", label: "Je ne sais pas", note: "Aide-moi à estimer" },
    ]
  },
  {
    id: "horizon_years",
    title: "Quel est votre horizon d'investissement ?",
    help: "Durée de placement",
    options: [
      { key: "1-3", label: "1-3 ans", note: "Court terme" },
      { key: "3-7", label: "3-7 ans", note: "Moyen terme" },
      { key: "7-15", label: "7-15 ans", note: "Long terme" },
      { key: "15+", label: "15+ ans", note: "Très long terme" },
      { key: "UNK", label: "Je ne sais pas", note: "Explique-moi les enjeux" },
    ]
  },
  {
    id: "wealth_share",
    title: "Quelle part de votre épargne souhaitez-vous investir ?",
    help: "Pourcentage de votre patrimoine",
    options: [
      { key: "10%", label: "Moins de 10%", note: "Très prudent" },
      { key: "25%", label: "10-25%", note: "Prudent" },
      { key: "50%", label: "25-50%", note: "Équilibré" },
      { key: "75%", label: "50-75%", note: "Dynamique" },
      { key: "UNK", label: "Je ne sais pas", note: "À calibrer" },
    ]
  },
  {
    id: "pref_return",
    title: "Quel rendement annuel visez-vous ?",
    help: "Objectif de performance",
    options: [
      { key: "3%", label: "3-4%", note: "Conservateur" },
      { key: "5%", label: "4-6%", note: "Modéré" },
      { key: "8%", label: "6-10%", note: "Dynamique" },
      { key: "12%", label: "10%+", note: "Agressif" },
      { key: "UNK", label: "Je ne sais pas", note: "À définir" },
    ]
  },
  {
    id: "asset_interest",
    title: "Quels actifs vous intéressent le plus ?",
    help: "Préférences d'investissement",
    options: [
      { key: "Obligations", label: "Obligations", note: "Sécurité" },
      { key: "ETF Monde", label: "ETF Monde", note: "Diversification" },
      { key: "Actions", label: "Actions", note: "Croissance" },
      { key: "Crypto", label: "Crypto", note: "Innovation" },
      { key: "UNK", label: "Je ne sais pas", note: "Ouvert" },
    ]
  },
  {
    id: "monthly_investment",
    title: "Combien pouvez-vous investir par mois ?",
    help: "Épargne mensuelle",
    options: [
      { key: "100", label: "100-300€", note: "Débutant" },
      { key: "500", label: "300-700€", note: "Intermédiaire" },
      { key: "1000", label: "700-1500€", note: "Confirmé" },
      { key: "2000", label: "1500€+", note: "Expert" },
      { key: "UNK", label: "Je ne sais pas", note: "Variable" },
    ]
  },
  {
    id: "reaction_drop",
    title: "Si votre portefeuille perd 15% en un mois ?",
    help: "Réaction face aux pertes",
    options: [
      { key: "1", label: "Je vends tout", note: "Très prudent" },
      { key: "2", label: "Je vends une partie", note: "Prudent" },
      { key: "3", label: "Je garde", note: "Équilibré" },
      { key: "4", label: "J'achète plus", note: "Dynamique" },
      { key: "UNK", label: "Je ne sais pas", note: "Besoin de coaching" },
    ]
  },
  {
    id: "follow_intensity",
    title: "À quelle fréquence suivez-vous les marchés ?",
    help: "Intensité de suivi",
    options: [
      { key: "1", label: "Jamais", note: "Passif" },
      { key: "2", label: "Mensuel", note: "Occasionnel" },
      { key: "3", label: "Hebdomadaire", note: "Régulier" },
      { key: "4", label: "Quotidien", note: "Actif" },
      { key: "UNK", label: "Je ne sais pas", note: "Flexible" },
    ]
  },
  {
    id: "reinvest",
    title: "Souhaitez-vous réinvestir automatiquement vos gains ?",
    help: "Stratégie de réinvestissement",
    options: [
      { key: "false", label: "Non", note: "Retirer les gains" },
      { key: "true", label: "Oui", note: "Intérêts composés" },
      { key: "UNK", label: "Je ne sais pas", note: "À tester" },
    ]
  }
];

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const total = QUESTIONS.length;
  const progress = step / total;
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const q = QUESTIONS[step];

  function selectAnswer(key: string) {
    setAnswers(prev => ({ ...prev, [q.id]: key }));
  }

  function next() {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const out = scoreFromAnswers(answers as any);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = mapToProfile(answers as any, out);
        sessionStorage.setItem('investy_result', JSON.stringify(result));
        router.push('/result');
      } catch (error) {
        console.error('Erreur lors du calcul du profil:', error);
        alert('Erreur lors du calcul de votre profil. Veuillez réessayer.');
      }
    }
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="font-medium text-gray-600">
              Question {step + 1} sur {total}
            </span>
            <span className="text-[#007AFF] font-semibold">
              {Math.round(progress * 100)}%
            </span>
          </div>
          
          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <ProgressCrypto progress={progress} />
          </div>
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
          {/* Question Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#007AFF]/10 text-[#007AFF] text-xs font-medium mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              {q.help}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">
              {q.title}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((o, idx) => {
              const isSelected = answers[q.id] === o.key;
              const isUnsure = o.key === "UNK";
              
              return (
                <button
                  key={o.key}
                  onClick={() => selectAnswer(o.key)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl",
                    "text-left",
                    "transition-all duration-200",
                    "border",
                    isSelected
                      ? "bg-[#007AFF]/10 border-[#007AFF]/30 shadow-[0_0_0_1px_rgba(0,122,255,0.2)]"
                      : "bg-white/60 border-black/[0.06] hover:bg-white/80 hover:border-black/[0.1]",
                    "active:scale-[0.99]"
                  )}
                >
                  {/* Number badge */}
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-semibold",
                    isSelected
                      ? "bg-[#007AFF] text-white"
                      : isUnsure
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-600"
                  )}>
                    {isSelected ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium",
                      isSelected ? "text-[#007AFF]" : "text-gray-900"
                    )}>
                      {o.label}
                    </div>
                    {o.note && (
                      <div className={cn(
                        "text-sm mt-0.5",
                        isSelected ? "text-[#007AFF]/70" : "text-gray-500"
                      )}>
                        {o.note}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl",
                "text-sm font-medium",
                "transition-all duration-200",
                step === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.04] active:scale-[0.98]"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
            
            <button
              type="button"
              onClick={next}
              disabled={!answers[q.id]}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl",
                "text-sm font-semibold text-white",
                "transition-all duration-200",
                answers[q.id]
                  ? "bg-[#007AFF] shadow-[0_2px_8px_rgba(0,122,255,0.25)] hover:bg-[#0066D6] hover:shadow-[0_4px_12px_rgba(0,122,255,0.3)] active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
              )}
            >
              {step < total - 1 ? (
                <>
                  Continuer
                  <ChevronRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Voir mes résultats
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Tes réponses sont confidentielles et ne sont pas partagées
        </p>
      </div>
    </main>
  );
}
