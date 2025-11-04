"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Newspaper, BarChart3, Star } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", Icon: Home },
  { href: "/actu", label: "Actu", Icon: Newspaper },
  { href: "/analyses", label: "Analyses", Icon: BarChart3 },
  { href: "/suivi-actifs", label: "Suivi", Icon: Star },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/60 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60"
      role="navigation"
      aria-label="Navigation mobile"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href} className="flex">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 py-2.5 flex flex-col items-center justify-center gap-1 text-xs ${active ? "text-blue-600" : "text-slate-600"}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}








