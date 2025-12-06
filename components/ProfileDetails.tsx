"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CreditCard, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

type UserPlan = {
  code: string;
  name: string;
  max_assets: number;
};

export default function ProfileDetails() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        setUser(sessionData.session.user);
        
        // Charger le plan de l'utilisateur
        try {
        const res = await fetch("/api/user/plan");
        if (res.ok) {
          const planData = await res.json();
          setPlan(planData);
        }
        } catch (e) {
          console.error("Error loading plan:", e);
        }
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleToggleNotifications = async () => {
    setEmailNotifications(!emailNotifications);
    // TODO: Sauvegarder la préférence dans la base de données
  };

  const handleChangePlan = () => {
    router.push("/plans");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "Utilisateur";

  return (
    <div className="space-y-6">
      {/* Informations utilisateur */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations personnelles</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <p className="text-sm text-slate-900">{userName}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <p className="text-sm text-slate-900">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Abonnement */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Abonnement</h2>
          <button
            onClick={handleChangePlan}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Changer de plan
          </button>
        </div>

        {plan ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{plan.name}</p>
                <p className="text-xs text-slate-500">
                  Jusqu'à {plan.max_assets} actif{plan.max_assets > 1 ? "s" : ""} suivi{plan.max_assets > 1 ? "s" : ""}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Chargement du plan...</p>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Notifications par email</p>
            <p className="text-xs text-slate-500">Recevoir des alertes par email</p>
          </div>
          
          <button
            onClick={handleToggleNotifications}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
              emailNotifications ? "bg-slate-900" : "bg-slate-200"
            )}
            role="switch"
            aria-checked={emailNotifications}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                emailNotifications ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

