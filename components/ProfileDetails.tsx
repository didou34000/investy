"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, CreditCard, CheckCircle2, Shield, LogOut,
  AlertTriangle, User, Mail, Lock, Activity, Trash2,
} from "lucide-react";

type AuthUser = { id: string; email: string; full_name?: string; plan?: string };

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.06)] p-5 md:p-6">
      {children}
    </div>
  );
}

function ToggleRow({ label, description, enabled, onToggle }: {
  label: string; description?: string; enabled: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          enabled ? "bg-slate-900" : "bg-slate-200"
        )}
        role="switch" aria-checked={enabled}
      >
        <span className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )} />
      </button>
    </div>
  );
}

export default function ProfileDetails() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyNotifications, setWeeklyNotifications] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setName(d.user.full_name || d.user.email.split("@")[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Prefs depuis localStorage
    const prefs = localStorage.getItem("invsty_prefs");
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        setEmailNotifications(p.email_notifications ?? true);
        setWeeklyNotifications(p.weekly_notifications ?? false);
      } catch {}
    }
  }, []);

  const savePrefs = (email: boolean, weekly: boolean) => {
    localStorage.setItem("invsty_prefs", JSON.stringify({ email_notifications: email, weekly_notifications: weekly }));
  };

  const handleSaveName = async () => {
    if (!user) return;
    setSavingName(true);
    setError(null);
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name }),
    });
    setSavingName(false);
    if (res.ok) {
      setUser((u) => u ? { ...u, full_name: name } : u);
      setSuccess("Prénom mis à jour ✓");
      setTimeout(() => setSuccess(null), 2000);
    } else {
      setError("Erreur lors de la sauvegarde");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) return setError("Les mots de passe ne correspondent pas.");
    if (newPassword.length < 6) return setError("Mot de passe trop court.");
    const res = await fetch("/api/auth/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      setPasswordModalOpen(false);
      setNewPassword(""); setConfirmPassword("");
      setSuccess("Mot de passe mis à jour ✓");
      setTimeout(() => setSuccess(null), 2000);
    } else {
      const d = await res.json();
      setError(d.error || "Erreur");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth");
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "SUPPRIMER") return setError('Tape "SUPPRIMER" pour confirmer.');
    const res = await fetch("/api/auth/delete-account", { method: "POST" });
    if (res.ok) router.push("/");
    else setError("Impossible de supprimer le compte.");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-20 bg-slate-200 rounded" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = name || user.email.split("@")[0];
  const isPremium = user.plan === "premium" || user.plan === "pro";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Paramètres du compte</h1>
        <p className="text-slate-500 text-sm mt-1">Gère tes informations, sécurité et notifications.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />{success}
        </div>
      )}

      {/* Informations personnelles */}
      <SettingsSection title="Informations personnelles">
        <SettingsCard>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Prénom / Nom</label>
                <div className="flex gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-[#F5F7FA] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <button onClick={handleSaveName} disabled={savingName}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-all shrink-0">
                    {savingName ? "..." : "Enregistrer"}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Email</label>
                <p className="text-sm text-slate-700 bg-[#F5F7FA] border border-slate-200 rounded-lg px-3 py-2">{user.email}</p>
              </div>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Sécurité */}
      <SettingsSection title="Sécurité">
        <SettingsCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Mot de passe</p>
                <p className="text-xs text-slate-500">Dernière mise à jour inconnue</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setPasswordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-all">
                <Lock className="w-4 h-4" /> Changer le mot de passe
              </button>
              <button onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-all">
                <LogOut className="w-4 h-4" /> Se déconnecter
              </button>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Abonnement */}
      <SettingsSection title="Abonnement">
        <SettingsCard>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Plan {isPremium ? (user.plan === "premium" ? "Premium" : "Pro") : "Gratuit"}
                </p>
                <p className="text-xs text-slate-500">{isPremium ? "Actif" : "Fonctionnalités de base"}</p>
              </div>
            </div>
            {!isPremium && (
              <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold">Bientôt</span>
            )}
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <SettingsCard>
          <div className="space-y-4">
            <ToggleRow label="Alertes de marché par email" description="Envoyées lors d'événements importants."
              enabled={emailNotifications} onToggle={() => { const n = !emailNotifications; setEmailNotifications(n); savePrefs(n, weeklyNotifications); }} />
            <ToggleRow label="Résumé hebdomadaire" description="Récap chaque lundi matin."
              enabled={weeklyNotifications} onToggle={() => { const n = !weeklyNotifications; setWeeklyNotifications(n); savePrefs(emailNotifications, n); }} />
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* Danger zone */}
      <SettingsSection title="Suppression du compte">
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-700 font-semibold">
            <AlertTriangle className="w-4 h-4" /> Zone dangereuse
          </div>
          <p className="text-sm text-red-600">Supprime définitivement ton compte et toutes tes données.</p>
          <button onClick={() => setDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all self-start">
            <Trash2 className="w-4 h-4" /> Supprimer le compte
          </button>
        </div>
      </SettingsSection>

      {/* Modal: mot de passe */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Nouveau mot de passe</h3>
            <input type="password" placeholder="Nouveau mot de passe" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
            <input type="password" placeholder="Confirmer" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setPasswordModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700">Annuler</button>
              <button onClick={handleUpdatePassword}
                className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold">Mettre à jour</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: suppression */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <AlertTriangle className="w-5 h-5" /> Supprimer le compte ?
            </div>
            <p className="text-sm text-slate-600">Cette action est irréversible. Tape <strong>SUPPRIMER</strong> pour confirmer.</p>
            <input type="text" value={confirmDelete} onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full border border-red-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200" />
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700">Annuler</button>
              <button onClick={handleDeleteAccount}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
