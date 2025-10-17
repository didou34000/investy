"use client";
import { useState } from "react";

export default function SimpleQuizPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  
  const questions = [
    {
      title: "Quelle perte annuelle maximale seriez-vous prêt à supporter ?",
      options: [
        { key: "5%", label: "5%", note: "Très conservateur" },
        { key: "10%", label: "10%", note: "Conservateur" },
        { key: "20%", label: "20%", note: "Modéré" },
        { key: "40%", label: "40%", note: "Agressif" },
      ]
    },
    {
      title: "Quel est votre horizon d'investissement ?",
      options: [
        { key: "1-3", label: "1-3 ans", note: "Court terme" },
        { key: "3-7", label: "3-7 ans", note: "Moyen terme" },
        { key: "7-15", label: "7-15 ans", note: "Long terme" },
        { key: "15+", label: "15+ ans", note: "Très long terme" },
      ]
    }
  ];

  const currentQ = questions[step];
  const progress = step / questions.length;

  const handleSelect = (key: string) => {
    console.log("Selecting:", key);
    setSelected(key);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      alert("Quiz terminé !");
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl px-4 py-6">
        
        {/* Progress Bar Simple */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Question {step + 1} sur {questions.length}</span>
            <span>{Math.round(progress * 100)}% complété</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              {currentQ.title}
            </h1>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`w-full text-left px-4 py-4 rounded-2xl border transition-all duration-200 ${
                  selected === option.key 
                    ? "border-blue-500 bg-blue-50 shadow-md" 
                    : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full text-[12px] grid place-items-center font-medium ${
                    selected === option.key 
                      ? "bg-blue-500 text-white" 
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] text-slate-900 font-medium">{option.label}</div>
                    <div className="text-[12px] text-slate-600 mt-0.5">{option.note}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    selected === option.key 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-slate-300"
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              disabled={step === 0}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retour
            </button>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step < questions.length - 1 ? 'Continuer' : 'Terminer'}
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm">
          <p><strong>Debug:</strong></p>
          <p>Step: {step}</p>
          <p>Selected: {selected || "None"}</p>
          <p>Progress: {Math.round(progress * 100)}%</p>
        </div>
      </div>
    </div>
  );
}
