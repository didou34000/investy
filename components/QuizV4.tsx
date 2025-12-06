"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { computeRiskScore, profileFromScore, allocationForScore } from "@/lib/riskEngine";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const QUESTIONS = [
  { id: "risk", q: "Comment réagis-tu si ton portefeuille perd 10% en un mois ?", options: [
    "Je vends tout 😨", "J'attends", "Je renforce 💪"
  ] },
  { id: "goal", q: "Ton objectif principal ?", options: [
    "Préserver", "Faire croître", "Multiplier 🔥"
  ] },
  { id: "horizon", q: "Ton horizon d'investissement ?", options: [
    "Moins de 3 ans", "3 à 10 ans", "10 ans et plus ⏳"
  ] },
  { id: "experience", q: "Ton expérience en investissement ?", options: [
    "Débutant", "Intermédiaire", "Avancé 💼"
  ] },
  { id: "income", q: "Tes revenus sont…", options: [
    "Très variables", "Stables", "Très stables 💰"
  ] },
  { id: "reserves", q: "Tu as combien de mois d'avance ?", options: [
    "Moins de 3", "3 à 6", "Plus de 6 ✅"
  ] },
  { id: "reaction", q: "Une baisse de marché te…", options: [
    "Inquiète beaucoup 😬", "Ne change rien", "Donne envie d'investir plus 💸"
  ] },
  { id: "knowledge", q: "Ta connaissance de la bourse ?", options: [
    "Faible", "Moyenne", "Bonne 📊"
  ] },
  { id: "follow", q: "Tu suis l'actualité économique ?", options: [
    "Jamais", "Parfois", "Souvent 🧠"
  ] },
  { id: "crypto", q: "Ton avis sur les cryptos ?", options: [
    "Trop risqué", "Intéressant", "J'y crois fort 🚀"
  ] },
];

export default function QuizV4() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSelect = (qid: string, val: number) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep(step + 1);
      else setDone(true);
    }, 400);
  };

  const score = computeRiskScore(Object.entries(answers).map(([id, value]) => ({ id, value })));
  const profile = profileFromScore(score);
  const alloc = allocationForScore(score);

  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];

  const handleSignup = async () => {
    // Simulation d'inscription (remplacer par Supabase)
    alert(`Compte créé pour ${name} (${email}) ! Bienvenue sur Invsty 🎉`);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white py-12">
      <AnimatePresence>
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center"
          >
            <h2 className="text-xl font-semibold mb-4">{QUESTIONS[step].q}</h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  className="border border-slate-300 rounded-xl px-4 py-3 hover:bg-blue-50 transition"
                  onClick={() => handleSelect(QUESTIONS[step].id, i + 1)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Question {step + 1}/{QUESTIONS.length}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-10"
          >
            <h2 className="text-3xl font-semibold text-center mb-2">{profile.name}</h2>
            <p className="text-slate-600 text-center mb-6">{profile.desc}</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="font-semibold mb-2 text-center">Ta répartition idéale</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={Object.entries(alloc).map(([k, v]) => ({ name: k, value: v }))} dataKey="value" label>
                      {Object.keys(alloc).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-purple-50 rounded-2xl p-6">
                <h3 className="font-semibold mb-2 text-center">Profil d'investisseur</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={[
                    { subject: "Tolérance", A: score },
                    { subject: "Rendement", A: score * 0.9 },
                    { subject: "Connaissance", A: score * 0.8 },
                    { subject: "Stabilité", A: 100 - score * 0.6 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <Radar dataKey="A" stroke={profile.color} fill={profile.color} fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-10 text-center">
              <h3 className="text-lg font-semibold mb-2">Reçois ton plan éducatif par email</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <input type="text" placeholder="Ton prénom" className="border rounded-lg px-3 py-2 w-48"
                  value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Ton email" className="border rounded-lg px-3 py-2 w-64"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleSignup} className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700">
                  S'inscrire
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
