import React from "react";
import { Clock3, List } from "lucide-react";
import { DashCard } from "./DashCard";

type Entry = {
  date: string;
  text: string;
};

type Props = {
  items?: Entry[];
};

export function HistoryList({ items }: Props) {
  const data =
    items && items.length > 0
      ? items
      : [
          { date: "7 déc. 2025", text: "Score enregistré dans ton compte." },
          { date: "5 déc. 2025", text: "Profil mis à jour après le quiz." },
          { date: "3 déc. 2025", text: "Connexion réussie depuis Safari." },
        ];

  return (
    <DashCard>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <List className="w-4 h-4 text-slate-500" />
          Historique rapide
        </div>
        <div className="divide-y divide-slate-100">
          {data.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start gap-3">
              <div className="mt-0.5">
                <Clock3 className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.text}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashCard>
  );
}

