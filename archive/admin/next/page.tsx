"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string; priority: "P0" | "P1" | "P2"; done?: boolean };

export default function NextPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Item["priority"]>("P1");

  useEffect(() => {
    const raw = localStorage.getItem("investy_next");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("investy_next", JSON.stringify(items));
  }, [items]);

  function add() {
    if (!title.trim()) return;
    setItems((prev) => [...prev, { id: `${Date.now()}`, title, priority }]);
    setTitle("");
  }

  function toggle(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: !it.done } : it)));
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <section className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">Plan d’itération</h1>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 rounded-md border px-3 py-2" placeholder="Nouvelle tâche" value={title} onChange={(e) => setTitle(e.target.value)} />
        <select className="rounded-md border px-2" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
          <option value="P0">P0</option>
          <option value="P1">P1</option>
          <option value="P2">P2</option>
        </select>
        <button className="rounded-md border px-3 py-2" onClick={add}>Ajouter</button>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between rounded-md border bg-white p-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={!!it.done} onChange={() => toggle(it.id)} aria-label={`Terminer ${it.title}`} />
              <span className="text-sm">[{it.priority}] {it.title}</span>
            </div>
            <button className="text-xs text-red-600" onClick={() => remove(it.id)} aria-label="Supprimer">Supprimer</button>
          </div>
        ))}
      </div>
    </section>
  );
}


