"use client";
import { useState } from "react";
import ResultChart from "./ResultChart";

export default function QuizForm() {
  const [email, setEmail] = useState("");
  const [monthly, setMonthly] = useState(200);
  const [horizon, setHorizon] = useState(10);
  const [res, setRes] = useState<any>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const answers = {
      age: 3,
      horizon,
      tolerance: 3,
      capacity: 3,
      experience: 2,
      drawdownOk: 2,
    };
    const r = await fetch("/api/quiz", {
      method: "POST",
      body: JSON.stringify({ email, answers, monthly, horizon }),
    });
    const j = await r.json();
    setRes(j);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          className="border rounded px-4 py-2"
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded px-4 py-2"
            type="number"
            min={50}
            step={10}
            value={monthly}
            onChange={(e) => setMonthly(+e.target.value)}
          />
          <input
            className="border rounded px-4 py-2"
            type="number"
            min={1}
            max={40}
            value={horizon}
            onChange={(e) => setHorizon(+e.target.value)}
          />
        </div>
        <button
          className="bg-blue-600 text-white rounded px-4 py-2 font-medium hover:bg-blue-700"
          type="submit"
        >
          Calculer mon profil
        </button>
      </form>

      {res && (
        <div className="bg-slate-50 p-4 rounded-md shadow">
          <h3 className="text-xl font-semibold">Profil : {res.profile}</h3>
          <ResultChart allocation={res.allocation} />
          <p className="text-sm text-slate-600">
            Simulation : environ{" "}
            <b>{Math.round(res.projection).toLocaleString("fr-FR")} €</b> après{" "}
            {res.horizon} ans avec {res.monthly} €/mois
          </p>
        </div>
      )}
    </div>
  );
}

