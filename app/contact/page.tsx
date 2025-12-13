"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  HelpCircle,
  Bug,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

const subjects = [
  { id: "question", label: "Question générale", icon: HelpCircle },
  { id: "bug", label: "Signaler un bug", icon: Bug },
  { id: "suggestion", label: "Suggestion d'amélioration", icon: Lightbulb },
  { id: "other", label: "Autre", icon: MessageSquare },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "question",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.message) {
      setErrorMessage("Merci de remplir tous les champs.");
      setStatus("error");
      return;
    }

    if (!formData.email.includes("@")) {
      setErrorMessage("Merci d&#39;entrer une adresse email valide.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      // Simulate sending (in production, this would call an API route)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // For now, we'll just log it and show success
      // In production, you'd send this to your backend/email service
      console.log("Contact form submitted:", formData);
      
      setStatus("success");
      setFormData({ email: "", subject: "question", message: "" });
    } catch {
      setErrorMessage("Une erreur est survenue. Réessaie plus tard.");
      setStatus("error");
    }
  };

  // Success state
  if (status === "success") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Message envoyé !</h1>
          <p className="text-slate-500 mb-8">
            Merci pour ton message. Nous te répondrons dans les plus brefs délais.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Retour à l'accueil
            </Link>
            <button
              onClick={() => setStatus("idle")}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Envoyer un autre message
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Nous contacter</h1>
          <p className="text-slate-500">
            Une question, un bug, une suggestion ? On est là pour t&apos;aider.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Ton email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ton@email.com"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sujet
            </label>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, subject: subject.id })}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    formData.subject === subject.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <subject.icon
                    className={`w-5 h-5 ${
                      formData.subject === subject.id ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.subject === subject.id ? "text-indigo-900" : "text-slate-600"
                    }`}
                  >
                    {subject.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
              Ton message
            </label>
            <textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Décris ta question ou ton problème..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Error message */}
          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Envoyer le message
              </>
            )}
          </button>
        </form>

        {/* Additional info */}
        <div className="mt-12 p-6 bg-slate-50 rounded-2xl">
          <h2 className="font-semibold text-slate-900 mb-4">Autres moyens de nous joindre</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">contact@invsty.app</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Délai de réponse habituel : 24-48h en jours ouvrés.
          </p>
        </div>

        {/* FAQ hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Tu cherches des réponses rapides ?{" "}
            <Link href="/result" className="text-indigo-600 font-medium hover:underline">
              Consulte ton plan
            </Link>{" "}
            ou{" "}
            <Link href="/quiz" className="text-indigo-600 font-medium hover:underline">
              refais le quiz
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
