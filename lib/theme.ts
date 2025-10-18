export const theme = {
  colors: {
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    muted: "#475569",
    border: "#E2E8F0",
    primary: "#0F172A",
    accent: "#2563EB",
    success: "#10B981",
    danger: "#EF4444",
  },
  radius: { sm: "0.5rem", md: "0.75rem", xl: "1rem", "2xl": "1.25rem" },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 8px 32px rgba(0,0,0,0.12)",
  },
  motion: { duration: 0.25, ease: [0.25, 0.8, 0.3, 1] as [number, number, number, number] },
};

export type Theme = typeof theme;
