"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { DashCard } from "@/components/dashboard/DashCard";
import { Section } from "@/components/dashboard/Section";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { StatGrid } from "@/components/dashboard/StatGrid";
import { ResultCard } from "@/components/dashboard/ResultCard";
import { SupportCards } from "@/components/dashboard/SupportCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ProjectionSparkline } from "@/components/dashboard/ProjectionSparkline";
import { HistoryList } from "@/components/dashboard/HistoryList";

type Profile = {
  id: string;
  email: string | null;
  quiz_score?: number | null;
  full_name?: string | null;
  risk_index?: number | null;
  allocation_actions?: number | null;
  allocation_bonds?: number | null;
  allocation_cash?: number | null;
  support?: string | null;
};

type ResultRow = {
  id: string;
  user_id: string;
  score: number | null;
  profile: string | null;
  horizon: string | null;
  support?: string | null;
  expected_return?: number | null;
  projection_10y?: number | null;
  created_at?: string | null;
  allocation: {
    cash?: number;
    bonds?: number;
    equities_core?: number;
    equities_tilts?: number;
    crypto?: number;
  } | null;
};

type ResultSnapshot = {
  score: number | null;
  profile: string;
  risk: number | null;
  allocation: { actions: number; bonds: number; cash: number };
  expectedReturn: number | null;
  horizon: string;
  support: string;
};

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
};

const formatDateTime = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastResult, setLastResult] = useState<ResultRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const updated = useRef(false);
  const [userMeta, setUserMeta] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      setAuthed(true);
      setUserMeta(user);

      const { data: lastRes } = await supabase
        .from("results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setLastResult(lastRes ?? null);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData && !profileData.quiz_score && !updated.current) {
        const score = typeof window !== "undefined" ? localStorage.getItem("quiz_score") : null;
        if (score) {
          const parsed = parseInt(score, 10);
          await supabase.from("profiles").update({ quiz_score: parsed }).eq("id", user.id);
          profileData.quiz_score = parsed;
          updated.current = true;
        }
      }

      setProfile(profileData || null);
      setLoading(false);
    };

    load();
  }, [supabase]);

  const resultSnapshot: ResultSnapshot | null = useMemo(() => {
    const srcScore = lastResult?.score ?? profile?.quiz_score;
    if (srcScore == null) return null;

    const risk = lastResult?.score ?? profile?.risk_index ?? srcScore;
    const profileLabel =
      (lastResult?.profile as string | null) ??
      (srcScore < 35 ? "Prudent" : srcScore < 55 ? "Équilibré" : srcScore < 75 ? "Modéré" : "Offensif");

    const actionsShare =
      (lastResult?.allocation?.equities_core ?? 0) + (lastResult?.allocation?.equities_tilts ?? 0);
    const allocation = {
      actions: actionsShare > 0 ? Math.round(actionsShare) : profile?.allocation_actions ?? 55,
      bonds: (lastResult?.allocation?.bonds != null ? Math.round(lastResult.allocation.bonds) : profile?.allocation_bonds) ?? 30,
      cash: (lastResult?.allocation?.cash != null ? Math.round(lastResult.allocation.cash) : profile?.allocation_cash) ?? 15,
    };

    const expectedReturn = risk ? Math.min(3 + risk * 0.15, 12) : null;
    const support =
      lastResult?.support ??
      profile?.support ??
      (srcScore < 50 ? "PEA prioritaire" : "PEA + CTO");
    const horizon =
      lastResult?.horizon ??
      (risk < 40 ? "3-5 ans" : risk < 60 ? "5-7 ans" : "7-10 ans");

    return {
      score: srcScore,
      profile: profileLabel,
      risk,
      allocation,
      expectedReturn,
      horizon,
      support,
    };
  }, [profile, lastResult]);

  const hasLastResult = Boolean(lastResult);

  if (loading) {
    return <p className="mt-20 text-center text-slate-600">Chargement...</p>;
  }

  if (authed === false) {
    return (
      <div className="mt-20 text-center text-slate-600">
        <p>Non connecté</p>
        <Link href="/auth" className="text-slate-900 font-semibold hover:underline">Se connecter</Link>
      </div>
    );
  }

  const createdAt = formatDate(userMeta?.created_at) ?? "N/A";
  const lastLogin = formatDateTime(userMeta?.last_sign_in_at) ?? "N/A";
  const greetingName = profile?.full_name || profile?.email?.split("@")[0] || "investisseur";
  const lastResultDate = formatDate(lastResult?.created_at);
  const scoreLabel = resultSnapshot?.score != null ? `${resultSnapshot.score}` : "—";
  const profileLabel = resultSnapshot?.profile ?? "Profil à définir";
  const supportLabel = resultSnapshot?.support ?? "Selon ton profil";
  const horizonLabel = resultSnapshot?.horizon ?? "—";
  const expectedReturnLabel = resultSnapshot?.expectedReturn
    ? `${resultSnapshot.expectedReturn.toFixed(1)}%`
    : "À définir";
  const projection10y = resultSnapshot?.expectedReturn
    ? `~ +${(resultSnapshot.expectedReturn * 10).toFixed(0)}%`
    : "À définir";

  const summaryStats = [
    { label: "Profil", value: profileLabel, hint: "Basé sur ton dernier résultat" },
    { label: "Score", value: scoreLabel, hint: "Indice de risque" },
    { label: "Support", value: supportLabel, hint: "Support recommandé" },
    { label: "Horizon", value: horizonLabel, hint: "Durée suggérée" },
    { label: "Projection 10 ans", value: projection10y, hint: "Estimation simple" },
  ];

  return (
    <main className="min-h-screen bg-[#F4F7FF]">
      <div className="max-w-7xl mx-auto px-4 lg:px-0 py-10 lg:py-12 space-y-8 lg:space-y-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/80 shadow-sm text-sm text-slate-600">
              <Sparkles className="w-4 h-4 text-[#4F63FF]" />
              Ton espace Invsty
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Bienvenue {greetingName} 👋</h1>
            <p className="text-sm text-slate-600">
              {hasLastResult
                ? `Ton profil actuel : ${profileLabel} — voici ton plan d’investissement.`
                : "Complète le quiz pour générer ton plan personnalisé."}
            </p>
            {lastResultDate && (
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/70 border border-white/80 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                Dernière mise à jour : {lastResultDate}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            >
              Faire le quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/result"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
            >
              Voir mes résultats
            </Link>
          </div>
        </div>

        {/* Résumé global */}
        <StatGrid stats={summaryStats} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-6 lg:gap-8">
          {/* Colonne gauche */}
          <div className="space-y-6">
            <Section title="Résultat récent" description="Résumé de ton dernier passage sur le quiz.">
              <ResultCard hasResult={hasLastResult} result={resultSnapshot && { ...resultSnapshot, horizon: horizonLabel }} />
            </Section>

            <Section title="Projections" description="Aperçu simplifié basé sur ton profil.">
              {hasLastResult && resultSnapshot ? (
                <div className="grid gap-4">
                  <ProjectionSparkline expectedReturn={resultSnapshot.expectedReturn} />
                  <DashCard>
                    <div className="p-4 grid md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500">Rendement annuel attendu</p>
                        <p className="text-lg font-semibold text-slate-900">{expectedReturnLabel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Projection 10 ans</p>
                        <p className="text-lg font-semibold text-slate-900">{projection10y}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Horizon recommandé</p>
                        <p className="text-lg font-semibold text-slate-900">{horizonLabel}</p>
                      </div>
                    </div>
                  </DashCard>
                </div>
              ) : (
                <DashCard>
                  <div className="p-4 text-sm text-slate-600">Complète le quiz pour voir les projections.</div>
                </DashCard>
              )}
            </Section>

            <Section title="Historique" description="Quelques actions récentes pour ton compte.">
              <HistoryList
                items={
                  lastResultDate
                    ? [{ date: lastResultDate, text: `Résultat ${profileLabel} enregistré.` }]
                    : undefined
                }
              />
            </Section>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            <Section title="Profil utilisateur">
              <ProfileCard email={profile?.email} createdAt={createdAt} lastLogin={lastLogin} plan={(profile as any)?.plan} />
            </Section>

            <Section title="Support recommandé">
              <SupportCards active={supportLabel} />
            </Section>

            <Section title="Actions rapides">
              <QuickActions />
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}

