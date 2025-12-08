import React from "react";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function Section({ title, description, children, action }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

