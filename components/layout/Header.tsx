"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/actu", label: "Actu" },
  { href: "/analyses", label: "Analyses" },
  { href: "/suivi-actifs", label: "Suivi actifs" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <Container className="h-16 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900" aria-label="Invsty Accueil">
          <img src="/logo.png" alt="Invsty" className="w-8 h-8 object-contain" />
          Invsty
        </Link>
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-slate-700 hover:text-slate-900 transition-colors ${active ? "text-slate-900" : ""}`}
              >
                {l.label}
                {active && <span className="absolute -bottom-2 left-0 right-0 mx-auto h-0.5 w-6 rounded-full bg-blue-600" />}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}








