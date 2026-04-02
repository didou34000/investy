"use client";
import AuthEmailCard from "@/components/AuthEmailCard";

type Props = {
  result: {
    profileLabel: string;
    riskIndex: number;
    expectedReturn: number;
    expectedVol: number;
    allocation: Record<string, number>;
    answers: any;
    emailPref?: string;
  };
};

export default function OnboardingPanel({ result }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-[#F5F7FA] rounded-2xl p-5">
        <h3 className="font-semibold text-slate-900 mb-1">Sauvegarde ton profil</h3>
        <p className="text-sm text-slate-500 mb-4">
          Crée un compte pour retrouver ton plan, suivre tes actifs et recevoir des alertes.
        </p>
        <AuthEmailCard planCode="free" />
      </div>
      <div className="p-4 bg-white border border-slate-200 rounded-2xl">
        <p className="text-xs text-slate-500">
          <strong>Profil :</strong> {result.profileLabel} · Risque {result.riskIndex}/100 · ~{result.expectedReturn.toFixed(1)}%/an
        </p>
      </div>
    </div>
  );
}
