"use client";

import Container from "@/components/ui/Container";
import { Newspaper, Brain, Bell, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

const items = [
  { icon: Newspaper, title: "Actualités agrégées", desc: "Flux multi-sources, dédoublonnés et normalisés." },
  { icon: Brain, title: "Analyse IA", desc: "Importance et impact estimés en continu." },
  { icon: Bell, title: "Alertes personnalisées", desc: "Soyez notifié quand ça compte pour vous." },
  { icon: ShieldCheck, title: "Respect des données", desc: "Aucune revente, conformité stricte." },
];

export default function Value() {
  return (
    <section className="py-16">
      <Container>
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Conçu pour créer de la valeur</h2>
          <p className="text-center text-slate-600 mb-10">Des fonctionnalités utiles, sans bruit.</p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-5 hover-lift"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-700 mb-3">
                <Icon className="w-5 h-5" aria-hidden />
              </div>
              <div className="font-semibold text-slate-900 mb-1">{title}</div>
              <p className="text-sm text-slate-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}






