import React from "react";
import { Mail, Calendar, Shield, Sparkles } from "lucide-react";
import { DashCard } from "./DashCard";

type Props = {
  email?: string | null;
  createdAt?: string;
  lastLogin?: string;
  plan?: string;
};

const colors = ["#4F63FF", "#6A5DFF", "#3B82F6", "#6366F1", "#0EA5E9", "#14B8A6"];

function getInitial(email?: string | null) {
  if (!email) return "I";
  return email.charAt(0).toUpperCase();
}

function getColor(email?: string | null) {
  if (!email) return colors[0];
  const code = email.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return colors[code % colors.length];
}

export function ProfileCard({ email, createdAt, lastLogin, plan }: Props) {
  const initial = getInitial(email);
  const color = getColor(email);
  const planLabel = plan || "Compte gratuit";
  const planTone = planLabel.toLowerCase().includes("premium") ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200";

  return (
    <DashCard>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-semibold text-white shadow-lg"
            style={{ background: color }}
          >
            {initial}
          </div>
          <div>
            <p className="text-sm text-slate-500">Utilisateur</p>
            <p className="text-base font-semibold text-slate-900">{email ?? "Non renseigné"}</p>
          </div>
          <div className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${planTone}`}>
            <Sparkles className="w-3.5 h-3.5" />
            {planLabel}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Compte créé : {createdAt ?? "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-500" />
            <span>Dernière connexion : {lastLogin ?? "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>Mail : {email ?? "—"}</span>
          </div>
        </div>
      </div>
    </DashCard>
  );
}

