/**
 * Helpers pour manipuler les dates en timezone Europe/Paris
 */

export function isToday(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return date >= todayStart && date <= todayEnd;
  } catch {
    return false;
  }
}

export function isLast7Days(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= sevenDaysAgo;
  } catch {
    return false;
  }
}

export function isLast30Days(dateString: string): boolean {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return date >= thirtyDaysAgo;
  } catch {
    return false;
  }
}

export function formatRelativeFR(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours} h`;
    if (diffDays === 1) return "hier";
    if (diffDays < 7) return `il y a ${diffDays} j`;
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export function formatDateFR(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

