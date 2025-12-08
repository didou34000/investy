import React from "react";
import { DashCard } from "./DashCard";
import { Check, Info } from "lucide-react";

type Support = "PEA" | "CTO" | "PEA + CTO" | string;

type Props = {
  active: Support;
};

const cards = [
  {
    key: "PEA",
    title: "PEA",
    desc: "Fiscalité avantageuse, idéal pour le long terme et les ETF éligibles.",
  },
  {
    key: "CTO",
    title: "CTO",
    desc: "Ouvert sur le monde, accès large aux marchés, plus de flexibilité.",
  },
];

export function SupportCards({ active }: Props) {
  return (
    <DashCard>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Info className="w-4 h-4 text-slate-500" />
          Support recommandé selon ton profil.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card) => {
            const isActive = active.toLowerCase().includes(card.key.toLowerCase());
            return (
              <div
                key={card.key}
                className={`rounded-xl border p-4 transition-all duration-200 ${
                  isActive
                    ? "border-blue-200 bg-blue-50 shadow-[0_10px_30px_rgba(59,130,246,0.14)]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold ${
                      isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {card.key}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                    <p className="text-xs text-slate-600">{card.desc}</p>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-blue-600" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashCard>
  );
}

