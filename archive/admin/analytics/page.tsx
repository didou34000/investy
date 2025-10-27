"use client";

import { useEffect, useMemo, useState } from "react";
import KpiCard from "@/components/KpiCard";
import EventsTable from "@/components/EventsTable";
import DateRangePicker, { type RangeKey } from "@/components/DateRangePicker";
import Sparkline from "@/components/Sparkline";

type Row = { id: string; name: string; ts: number; ua?: string | null; payload?: Record<string, unknown> };

export default function AnalyticsAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [range, setRange] = useState<RangeKey>("7d");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then((j) => setRows(j.events ?? [])).catch(() => setRows([]));
  }, []);

  const cutoff = useMemo(() => {
    const now = Date.now();
    if (range === "1d") return now - 24 * 60 * 60 * 1000;
    if (range === "7d") return now - 7 * 24 * 60 * 60 * 1000;
    return now - 30 * 24 * 60 * 60 * 1000;
  }, [range]);

  const filtered = rows.filter((r) => r.ts >= cutoff);
  const kpis = useMemo(() => {
    const count = (name: string) => filtered.filter((r) => r.name === name).length;
    return {
      total: filtered.length,
      quizStart: count("quiz_start"),
      quizComplete: count("quiz_complete"),
      subscribeSuccess: count("subscribe_success"),
      feedbackSubmit: count("feedback_submit"),
    };
  }, [filtered]);

  const byDay = (name: string) => {
    const days: Record<string, number> = {};
    filtered.filter((r) => r.name === name).forEach((r) => {
      const d = new Date(r.ts); const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      days[key] = (days[key] || 0) + 1;
    });
    const out: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i*24*60*60*1000);
      const key = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      out.push(days[key] || 0);
    }
    return out;
  };

  return (
    <section className="container py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Events" value={kpis.total} />
        <KpiCard label="Quiz start" value={kpis.quizStart} />
        <KpiCard label="Quiz complete" value={kpis.quizComplete} />
        <KpiCard label="Subscribe" value={kpis.subscribeSuccess} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-slate-600 mb-2">Quiz start (7 jours)</div>
          <Sparkline values={byDay("quiz_start")} />
        </div>
        <div>
          <div className="text-sm text-slate-600 mb-2">Subscribe (7 jours)</div>
          <Sparkline values={byDay("subscribe_success")} />
        </div>
      </div>

      <div className="mt-6">
        <EventsTable rows={filtered} />
      </div>
    </section>
  );
}


