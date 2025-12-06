"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProfileHeader from "@/components/ProfileHeader";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/quiz", label: "Quiz" },
  { href: "/actu", label: "Actu", soon: true },
  { href: "/analyses", label: "Analyses", soon: true },
];

export default function NavBarMinimal() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data?.session);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl border",
        scrolled 
          ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-lg shadow-slate-900/5" 
          : "bg-white/90 backdrop-blur-xl border-slate-200/80 shadow-md shadow-slate-900/5"
      )}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Invsty" className="h-8 w-8 object-contain" />
              <span className="text-lg font-bold text-slate-900">
                Invsty
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.soon ? "/soon" : link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    link.soon 
                      ? "text-slate-400 hover:text-slate-500" 
                      : isActive(link.href) 
                        ? "text-slate-900 bg-slate-100" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {link.soon && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded">
                        Soon
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <ProfileHeader />
              ) : (
                <>
                  <Link 
                    href="/auth" 
                    className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/quiz"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                  >
                    Faire le quiz
                  </Link>
                </>
              )}
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="p-4 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.soon ? "/soon" : link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium",
                      link.soon ? "text-slate-400" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                    {link.soon && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded">
                        Soon
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="p-4 pt-2 border-t border-slate-100">
                {isAuthenticated ? (
                  <div className="px-4">
                    <ProfileHeader />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/quiz"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-4 py-3 text-center text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all"
                    >
                      Quiz
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
