import React from "react";

export default function EmptyState({ title = "Aucun élément", subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-sm">
      <div className="mx-auto mb-2 size-10 rounded-full border border-dashed opacity-60" />
      <div className="font-medium text-[var(--foreground)]">{title}</div>
      {subtitle ? <div className="mt-1 text-sm text-[var(--muted)]">{subtitle}</div> : null}
    </div>
  );
}


