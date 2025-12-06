import { ArrowRight, Target, PieChart, Bell } from "lucide-react";

export default function Storyline() {
  const items = [
    { 
      title: "Découvre ton profil", 
      desc: "Un quiz clair pour situer ton appétence au risque et ton horizon.", 
      href: "/quiz",
      icon: Target
    },
    { 
      title: "Vois où placer selon toi", 
      desc: "Une répartition type et une simulation chiffrée, sans jargon.", 
      href: "#allocation",
      icon: PieChart
    },
    { 
      title: "On suit le marché pour toi", 
      desc: "Des explications simples quand l'économie bouge.", 
      href: "#suivi",
      icon: Bell
    },
  ];

  return (
    <section className="py-16" aria-labelledby="storyline-title">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <h2 id="storyline-title" className="text-2xl md:text-3xl font-semibold text-center mb-8 text-investy-textPrimary">
          La première plateforme qui suit le marché pour vous
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="bg-investy-surface border border-white/5 rounded-2xl backdrop-blur-sm p-6 hover:border-white/10 hover:-translate-y-[2px] hover:shadow-lg hover:shadow-black/40 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-investy-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-investy-textPrimary">{item.title}</h3>
                </div>
                <p className="text-investy-textMuted text-sm mb-3">{item.desc}</p>
                <a href={item.href} className="text-investy-accent text-sm underline inline-flex items-center gap-1 hover:no-underline">
                  En savoir plus
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
