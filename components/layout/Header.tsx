"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Menu, X, User } from "lucide-react";

const publicLinks = [
  { href: "/", label: "Accueil" },
  { href: "/quiz", label: "Quiz" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Don't show header on quiz page (cleaner experience)
  if (pathname === "/quiz") return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2.5 font-bold text-slate-900 text-lg" 
          aria-label="Invsty Accueil"
        >
          <img src="/logo.png" alt="Invsty" className="w-8 h-8 object-contain" />
          <span>Invsty</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-8 text-sm">
          {publicLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative font-medium transition-colors ${
                  active ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side - Auth */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-20 h-9 bg-slate-100 rounded-lg animate-pulse" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              <User className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/quiz"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Faire le quiz
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 -mr-2 text-slate-600"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-lg">
          <nav className="px-6 py-4 space-y-1">
            {publicLinks.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl font-medium ${
                    active ? "bg-slate-100 text-slate-900" : "text-slate-600"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            
            <div className="pt-2 mt-2 border-t border-slate-100">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl font-medium text-slate-900 bg-slate-100"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-xl font-medium text-slate-600"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/quiz"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 mt-1 rounded-xl font-medium text-white bg-slate-900 text-center"
                  >
                    Faire le quiz
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
