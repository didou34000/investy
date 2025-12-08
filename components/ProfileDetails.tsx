"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CreditCard,
  CheckCircle2,
  Shield,
  LogOut,
  AlertTriangle,
  User,
  Mail,
  Lock,
  Activity,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type UserPlan = {
  code: string;
  name: string;
  max_assets: number;
  status?: "active" | "inactive";
};

type ProfileRow = {
  id: string;
  email: string | null;
  quiz_score?: number | null;
  full_name?: string | null;
  alerts?: boolean | null;
  weekly?: boolean | null;
};

type ActivityItem = { title: string; detail: string };

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

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
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
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2",
          enabled ? "bg-slate-900" : "bg-slate-200"
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

function DangerZone({
  onDelete,
}: {
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-red-700 font-semibold">
        <AlertTriangle className="w-4 h-4" />
        Zone dangereuse
      </div>
      <p className="text-sm text-red-600">Supprimer définitivement ton compte et tes données.</p>
      <button
        onClick={onDelete}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all active:scale-[0.99]"
      >
        <Trash2 className="w-4 h-4" />
        Supprimer le compte
      </button>
    </div>
  );
}

export default function ProfileDetails() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyNotifications, setWeeklyNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingName, setSavingName] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
        setName(userData.user.user_metadata?.name || userData.user.email?.split("@")[0] || "");
        setNewEmail(userData.user.email ?? "");
      }
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData?.user?.id ?? "")
        .single();
      if (profileRow) {
        setProfile(profileRow);
        setEmailNotifications(profileRow.alerts ?? true);
        setWeeklyNotifications(profileRow.weekly ?? false);
      }

      try {
        const res = await fetch("/api/user/plan");
        if (res.ok) {
          const planData = await res.json();
          setPlan(planData);
        }
      } catch (e) {
        console.error("Error loading plan:", e);
      }

      setLoading(false);
    };

    loadData();
  }, [supabase]);

  const saveNotifications = async (alerts: boolean, weekly: boolean) => {
    if (!user) return;
    setProfile((p) => (p ? { ...p, alerts, weekly } : p));
    await supabase.from("profiles").update({ alerts, weekly }).eq("id", user.id);
  };

  const handleToggleAlerts = () => {
    const next = !emailNotifications;
    setEmailNotifications(next);
    saveNotifications(next, weeklyNotifications);
  };

  const handleToggleWeekly = () => {
    const next = !weeklyNotifications;
    setWeeklyNotifications(next);
    saveNotifications(emailNotifications, next);
  };

  const handleChangePlan = () => {
    router.push("/plans");
  };

  const handleSaveName = async () => {
    if (!user) return;
    setSavingName(true);
    setError(null);
    const { error: err } = await supabase.auth.updateUser({
      data: { name },
    });
    await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setSavingName(false);
    setEditingName(false);
    if (err) setError(err.message);
  };

  const handleUpdateEmail = async () => {
    if (!user) return;
    setError(null);
    const { error: err } = await supabase.auth.updateUser({
      email: newEmail,
    });
    if (err) setError(err.message);
    else setEmailModalOpen(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    const { error: err } = await supabase.auth.updateUser({ password: newPassword });
    if (err) setError(err.message);
    else setPasswordModalOpen(false);
  };

  const handleLogoutAll = async () => {
    await supabase.auth.signOut({ scope: "global" } as any);
    router.push("/auth");
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "SUPPRIMER") return;
    const res = await fetch("/api/delete-account", { method: "POST" });
    if (res.ok) {
      await supabase.auth.signOut();
      router.push("/");
    } else {
      setError("Impossible de supprimer le compte.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-20 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = name || user.email?.split("@")[0] || "Utilisateur";
  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A";
  const lastLogin = user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "N/A";

  const history: ActivityItem[] = [
    { title: "Connexion réussie", detail: lastLogin },
    { title: "Compte créé", detail: createdAt },
    { title: "Email actuel", detail: user.email },
  ].slice(0, 3);

  const isPremium = plan?.code === "premium" || plan?.code === "pro";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Paramètres du compte</h1>
        <p className="text-slate-500 text-sm">Gère tes informations, sécurité et notifications.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <SettingsSection title="Informations personnelles">
        <SettingsCard>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all"
                  >
                    {savingName ? "Sauvegarde..." : "Enregistrer"}
                  </button>
                </div>
                <p className="text-sm text-slate-500">Email : {user.email}</p>
                <p className="text-xs text-slate-400">Compte créé le : {createdAt}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setEmailModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
              >
                <Mail className="w-4 h-4" />
                Changer d'email
              </button>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Sécurité du compte">
        <SettingsCard>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">Session active</p>
                <p className="text-xs text-slate-500">Dernière connexion : {lastLogin}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPasswordModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
              >
                <Lock className="w-4 h-4" />
                Changer le mot de passe
              </button>
              <button
                onClick={handleLogoutAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-800 hover:-translate-y-0.5 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion tous appareils
              </button>
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Abonnement">
        <SettingsCard>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{plan?.name || "Plan en chargement"}</p>
                <p className="text-xs text-slate-500">
                  Statut : {plan?.status ?? (isPremium ? "actif" : "inactif")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPremium ? (
                <button
                  onClick={handleChangePlan}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
                >
                  Gérer l’abonnement
                </button>
              ) : (
                <button
                  onClick={handleChangePlan}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
                >
                  Passer Premium
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">Vous pouvez annuler à tout moment.</p>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingsCard>
          <div className="space-y-4">
            <ToggleRow
              label="Recevoir les alertes de marché"
              description="Alertes envoyées par email."
              enabled={emailNotifications}
              onToggle={handleToggleAlerts}
            />
            <ToggleRow
              label="Recevoir les résumés hebdomadaires"
              enabled={weeklyNotifications}
              onToggle={handleToggleWeekly}
            />
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Activité du compte">
        <SettingsCard>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Dernière connexion</p>
                <p className="text-xs text-slate-500">{lastLogin}</p>
              </div>
            </div>
            <div className="space-y-2">
              {history.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SettingsCard>
      </SettingsSection>

      <SettingsSection title="Suppression du compte">
        <DangerZone onDelete={() => setDeleteModalOpen(true)} />
      </SettingsSection>

      {/* Email modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Changer d’email</h3>
            <p className="text-sm text-slate-500">Un lien de confirmation sera envoyé sur le nouvel email.</p>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="nouvel-email@exemple.com"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateEmail}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Changer le mot de passe</h3>
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Nouveau mot de passe"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Confirmer le mot de passe"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdatePassword}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Supprimer le compte
            </h3>
            <p className="text-sm text-slate-600">
              Cette action est irréversible. Tape <strong>SUPPRIMER</strong> pour confirmer.
            </p>
            <input
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              placeholder="SUPPRIMER"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmDelete !== "SUPPRIMER"}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

