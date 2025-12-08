import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function DashCard({ children, className }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_16px_50px_rgba(0,0,0,0.06)] ${className || ""}`}
    >
      {children}
    </div>
  );
}

