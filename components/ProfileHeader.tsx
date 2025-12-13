"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown, CheckCircle2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

export default function ProfileHeader() {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
      }
      setLoading(false);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || !user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Utilisateur";
  const userInitial = (userName?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/60 bg-white/80 backdrop-blur hover:border-slate-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all focus:outline-none focus:ring-2 focus:ring-slate-200"
        aria-label="Menu profil"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F63FF] to-[#6A5DFF] text-white flex items-center justify-center text-sm font-semibold shadow">
          {userInitial}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            {userName}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connecté
            </span>
          </span>
          <span className="text-xs text-slate-500">{user.email}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-white/80 py-2 z-50">
          <div className="px-4 py-3 border-b border-slate-100/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F63FF] to-[#6A5DFF] text-white flex items-center justify-center text-sm font-semibold shadow">
                {userInitial}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  {userName}
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Mon profil
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Paramètres
            </button>

            <div className="px-4 py-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100/60 rounded-lg px-3 py-2">
                <Sparkles className="w-4 h-4 text-[#4F63FF]" />
                Accès premium bientôt disponible.
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

