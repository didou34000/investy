"use client";

import { useEffect, useMemo, useState } from "react";
import Checklist from "@/components/Checklist";

function useAutoChecks() {
  const [status, setStatus] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    const run = async () => {
      const checks: Record<string, boolean | null> = {};
      async function ok(path: string) {
        try { const r = await fetch(path, { method: "GET" }); return r.status < 400; } catch { return false; }
      }
      checks["route_home"] = await ok("/");
      checks["route_quiz"] = await ok("/quiz");
      checks["route_result"] = await ok("/result");
      checks["route_legal"] = await ok("/legal");
      checks["consent"] = typeof window !== "undefined" ? !!localStorage.getItem("investy_cookie_consent") : null;
      const ffQuiz = localStorage.getItem("ff_quiz_variant");
      const ffCta = localStorage.getItem("ff_cta_copy");
      checks["flags"] = ["A", "B"].includes(ffQuiz || "A") && ["A", "B"].includes(ffCta || "A");
      setStatus(checks);
    };
    run();
  }, []);

  return status;
}

export default function QaPage() {
  const status = useAutoChecks();
  const itemsA11y = useMemo(() => [
    { id: "focus", label: "Focus visibles" },
    { id: "aria", label: "Aria-labels sur boutons clés" },
    { id: "contrast", label: "Contrastes suffisants" },
  ], []);
  const itemsResp = useMemo(() => [
    { id: "m360", label: "Responsive 360px" },
    { id: "t768", label: "Responsive 768px" },
    { id: "d1024", label: "Responsive 1024+" },
  ], []);
  const itemsFlow = useMemo(() => [
    { id: "home-quiz", label: "Accueil → Quiz" },
    { id: "quiz-result", label: "Quiz → Résultat" },
    { id: "result-email", label: "Formulaire email OK" },
  ], []);

  return (
    <section className="container py-8">
      <h1 className="text-2xl font-semibold">QA interne</h1>
      <div className="mt-4 rounded-md border bg-white p-4">
        <div className="font-medium mb-2">Auto-checks</div>
        <ul className="grid gap-1 text-sm text-slate-700">
          {Object.entries(status).map(([k,v]) => (
            <li key={k}>{k}: {v === null ? "N/A" : v ? "✅" : "❌"}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Checklist title="Accessibilité" storageKey="investy_qa_a11y" items={itemsA11y} />
        <Checklist title="Responsive" storageKey="investy_qa_resp" items={itemsResp} />
        <Checklist title="Parcours" storageKey="investy_qa_flow" items={itemsFlow} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Validation de sortie MVP</h2>
        <Checklist
          title="Checklist finale"
          storageKey="investy_qa_final"
          items={[
            { id: "home", label: "Accueil clair (claim + CTA)" },
            { id: "quiz", label: "Quiz fluide (6 Q)" },
            { id: "result", label: "Résultats lisibles (profil + simulation)" },
            { id: "email", label: "Form email fonctionne (JSON OK)" },
            { id: "legal", label: "/legal complet + disclaimers" },
            { id: "cookies", label: "Cookies banner OK (accept/refuse)" },
            { id: "debug", label: "Debug off par défaut" },
            { id: "resp", label: "Responsive 360/768/1024/1280" },
            { id: "console", label: "Console propre (aucune erreur)" },
            { id: "errors", label: "/not-found + error boundary" },
            { id: "health", label: "/health OK (page + API)" },
            { id: "analytics", label: "Analytics local OK (events)" },
          ]}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Script de test (8 étapes)</h2>
        <Checklist
          title="Parcours Manuel"
          storageKey="investy_qa_script"
          items={[
            { id: "s1", label: "1) / → claim + CTA + disclaimers" },
            { id: "s2", label: "2) CTA → /quiz → quiz_start" },
            { id: "s3", label: "3) Répondre aux 6 Q → bouton actif" },
            { id: "s4", label: "4) Valider → /result → profil + simulation" },
            { id: "s5", label: "5) /result → email → succès" },
            { id: "s6", label: "6) /feedback → message → listé" },
            { id: "s7", label: "7) /admin/kpi → events visibles" },
            { id: "s8", label: "8) /legal → sommaire + ancres" },
          ]}
        />
      </div>
    </section>
  );
}


