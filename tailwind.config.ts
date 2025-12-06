import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // iOS Glassmorphism Design System
        glass: {
          bg: "#F5F7FA",           // Fond principal très clair
          panel: "rgba(255,255,255,0.72)",  // Glass panel semi-transparent
          card: "rgba(255,255,255,0.65)",   // Glass card
          stroke: "rgba(255,255,255,0.5)",  // Bordure glass
          strokeLight: "rgba(255,255,255,0.25)",
          hover: "rgba(255,255,255,0.85)",  // Glass hover state
          overlay: "rgba(255,255,255,0.4)", // Overlay léger
          dark: "rgba(0,0,0,0.02)",         // Fond subtil
        },
        // Couleurs sémantiques iOS
        ios: {
          blue: "#007AFF",
          green: "#34C759",
          red: "#FF3B30",
          orange: "#FF9500",
          yellow: "#FFCC00",
          purple: "#AF52DE",
          pink: "#FF2D55",
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
        // Legacy support
        investy: {
          bg: "#050816",
          bgSoft: "#0B1120",
          surface: "#111827",
          surfaceSoft: "#020617",
          border: "#1F2937",
          textPrimary: "#F9FAFB",
          textMuted: "#9CA3AF",
          accent: "#FFFFFF",
          accentSoft: "rgba(255,255,255,0.06)",
        },
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["SF Pro Display", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        // iOS-style soft shadows
        "glass": "0 4px 30px rgba(0, 0, 0, 0.08)",
        "glass-sm": "0 2px 15px rgba(0, 0, 0, 0.05)",
        "glass-lg": "0 8px 40px rgba(0, 0, 0, 0.12)",
        "glass-xl": "0 12px 50px rgba(0, 0, 0, 0.15)",
        "glass-inset": "inset 0 1px 1px rgba(255, 255, 255, 0.4)",
        "glass-glow": "0 0 40px rgba(0, 122, 255, 0.15)",
        // Button shadows
        "btn": "0 2px 8px rgba(0, 0, 0, 0.08)",
        "btn-hover": "0 4px 16px rgba(0, 0, 0, 0.12)",
        "btn-active": "0 1px 4px rgba(0, 0, 0, 0.08)",
      },
      backgroundImage: {
        // iOS gradient backgrounds
        "glass-gradient": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        "ios-gradient": "linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)",
        "ios-gradient-soft": "linear-gradient(180deg, #F8FAFC 0%, #EFF3F8 50%, #E8EDF4 100%)",
        "ios-mesh": "radial-gradient(at 40% 20%, rgba(0, 122, 255, 0.08) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(175, 82, 222, 0.06) 0%, transparent 50%), radial-gradient(at 0% 100%, rgba(52, 199, 89, 0.05) 0%, transparent 50%)",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 12s ease-in-out infinite",
        "pulse-soft": "subtlePulse 8s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        float: {
          "0%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-8px) translateX(4px)" },
          "100%": { transform: "translateY(0px) translateX(0px)" },
        },
        subtlePulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 122, 255, 0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 122, 255, 0.2)" },
        },
      },
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "350": "350ms",
      },
      transitionTimingFunction: {
        "ios": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "ios-spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};

export default config;
