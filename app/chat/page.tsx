"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string; ts: number };

const SUGGESTIONS = [
  "Quelle allocation pour un profil modéré ?",
  "C'est quoi un ETF ?",
  "Différence PEA vs CTO ?",
  "Comment investir 200€ par mois ?",
];

const RESPONSES: Record<string, string> = {
  etf: "Un ETF (Exchange Traded Fund) est un fonds indiciel coté en bourse. Il réplique un indice (ex: MSCI World) à faible coût. Idéal pour diversifier sans choisir chaque action.",
  allocation: "Pour un profil modéré, une allocation classique est : 60% actions/ETF, 30% obligations, 10% liquidités. Cela offre un bon équilibre rendement/risque sur 5-7 ans.",
  pea: "Le PEA (Plan d'Épargne en Actions) est exonéré d'impôts après 5 ans (hors prélèvements sociaux). Il est limité à 150 000€ et aux actions européennes. Le CTO n'a pas ces limites géographiques mais est fiscalisé à 30%.",
  "200": "Avec 200€/mois, la stratégie la plus efficace est un investissement programmé dans un ETF MSCI World via PEA. Sur 10 ans à 6% annuels, ça représente ~32 000€ (dont ~8 000€ de gains).",
  risque: "Le risque en investissement mesure la probabilité de perdre de la valeur. Il est lié à la volatilité. Un profil prudent préfère la stabilité, un profil dynamique accepte plus de fluctuations pour de meilleures perspectives.",
  default: "C'est une bonne question ! Pour une réponse personnalisée, je te recommande de compléter ton profil via le quiz. Tu peux aussi consulter les analyses disponibles dans ton dashboard.",
};

function getAutoReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("etf") || m.includes("fonds")) return RESPONSES.etf;
  if (m.includes("allocation") || m.includes("répartition") || m.includes("modéré")) return RESPONSES.allocation;
  if (m.includes("pea") || m.includes("cto")) return RESPONSES.pea;
  if (m.includes("200") || m.includes("mensuel") || m.includes("mois")) return RESPONSES["200"];
  if (m.includes("risque") || m.includes("volatil")) return RESPONSES.risque;
  return RESPONSES.default;
}

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Salut ! Je suis ton assistant investissement. Pose-moi tes questions sur l'allocation, les ETF, la fiscalité ou ton profil 👋", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok ? r.json() : { user: null })
      .then((d) => {
        if (!d.user) router.replace("/auth");
        else setChecking(false);
      })
      .catch(() => router.replace("/auth"));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const reply = getAutoReply(text);
    setMessages((m) => [...m, { role: "assistant", content: reply, ts: Date.now() }]);
    setLoading(false);
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 h-16 flex items-center px-6 gap-4">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Assistant invsty</p>
            <p className="text-xs text-emerald-500">En ligne</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-20 pb-32 px-4 max-w-2xl mx-auto w-full">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-br-sm"
                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm"
              }`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions + Input */}
      <div className="fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-lg border-t border-slate-200/60 px-4 pb-6 pt-3">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 bg-[#F5F7FA] border border-slate-200 rounded-full text-slate-600 hover:bg-slate-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose ta question..."
              className="flex-1 bg-[#F5F7FA] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
            />
            <button type="submit" disabled={!input.trim() || loading}
              className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 disabled:opacity-40 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
