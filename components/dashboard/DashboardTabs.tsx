import React, { useEffect, useMemo, useState } from "react";

const tabs = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "profil", label: "Profil" },
  { id: "financier", label: "Financier" },
  { id: "portefeuille", label: "Portefeuille" },
  { id: "analyse", label: "Analyse & risques" },
  { id: "conseils", label: "Conseils" },
  { id: "historique", label: "Historique" },
];

export function DashboardTabs() {
  const [active, setActive] = useState<string>("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0));
        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    tabs.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tabList = useMemo(() => tabs, []);

  return (
    <div className="sticky top-16 z-20 bg-[#F7FAFF]/80 backdrop-blur border-b border-white/60 py-3">
      <div className="flex flex-wrap gap-2">
        {tabList.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`px-3 py-1.5 rounded-full border text-sm font-semibold transition ${
              active === tab.id
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
