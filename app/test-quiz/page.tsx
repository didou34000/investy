"use client";
import { useState } from "react";

export default function TestQuizPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  
  const options = [
    { key: "5%", label: "5%", note: "Très conservateur" },
    { key: "10%", label: "10%", note: "Conservateur" },
    { key: "20%", label: "20%", note: "Modéré" },
    { key: "40%", label: "40%", note: "Agressif" },
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Quiz - Debug</h1>
        
        <div className="mb-4">
          <p>Step: {step}</p>
          <p>Selected: {selected || "None"}</p>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option.key}
              onClick={() => {
                console.log("Clicked:", option.key);
                setSelected(option.key);
              }}
              className={`w-full text-left px-4 py-4 rounded-2xl border transition ${
                selected === option.key 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full text-[12px] grid place-items-center ${
                  selected === option.key 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] text-slate-900">{option.label}</div>
                  <div className="text-[12px] text-slate-600 mt-0.5">{option.note}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border ${
                  selected === option.key 
                    ? "bg-blue-500 border-blue-500" 
                    : "border-slate-300"
                }`} />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 disabled:opacity-50"
          >
            Retour
          </button>
          <button
            onClick={() => setStep(step + 1)}
            disabled={!selected}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
