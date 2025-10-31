"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string; status?: "todo" | "done" | "na" };

export default function Checklist({ title, storageKey, items }: { title: string; storageKey: string; items: Item[] }) {
  const [state, setState] = useState<Record<string, Item["status"]>>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setState(JSON.parse(raw));
  }, [storageKey]);

  function cycle(id: string) {
    setState((prev) => {
      const current = prev[id] ?? "todo";
      const next = current === "todo" ? "done" : current === "done" ? "na" : "todo";
      const nextState = { ...prev, [id]: next };
      localStorage.setItem(storageKey, JSON.stringify(nextState));
      return nextState;
    });
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="font-semibold mb-2">{title}</div>
      <ul className="grid gap-2">
        {items.map((it) => {
          const s = state[it.id] ?? it.status ?? "todo";
          const color = s === "done" ? "bg-green-500" : s === "na" ? "bg-slate-400" : "bg-yellow-500";
          const label = s === "done" ? "✅" : s === "na" ? "N/A" : "⏳";
          return (
            <li key={it.id} className="flex items-center gap-2">
              <button aria-label={`Basculer ${it.label}`} className={`h-4 w-4 rounded ${color}`} onClick={() => cycle(it.id)} />
              <span className="text-sm">{label} {it.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


