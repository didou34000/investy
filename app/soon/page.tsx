"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, Mail, Sparkles, Newspaper, BarChart3, BellRing, Check } from "lucide-react";
import { useState } from "react";

export default function SoonPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const features = [
    { icon: Newspaper, label: "Actualités" },
    { icon: BarChart3, label: "Analyses" },
    { icon: BellRing, label: "Alertes" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-20 bg-neutral-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="p-10 bg-white rounded-2xl border border-neutral-100 shadow-sm">
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          {/* Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full border border-blue-100">
              En développement
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 text-center mb-3">
            Bientôt disponible
          </h1>

          {/* Description */}
          <p className="text-neutral-500 text-center mb-8">
            Cette fonctionnalité arrive très bientôt. En attendant, découvre ton profil investisseur.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 bg-neutral-50 rounded-xl"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-neutral-600">{feature.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Email signup */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton email"
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700">On te prévient dès que c'est prêt</span>
            </motion.div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/quiz"
              className="w-full py-3.5 text-center text-sm font-semibold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800 transition-all"
            >
              Faire le quiz maintenant
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
