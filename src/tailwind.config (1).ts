import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          glow: "hsl(var(--primary-glow))",
        },
        emerald: {
          DEFAULT: "hsl(var(--emerald))",
          light: "hsl(var(--emerald-light))",
          foreground: "hsl(var(--emerald-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          bg: "hsl(var(--success-bg))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          bg: "hsl(var(--warning-bg))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
          bg: "hsl(var(--danger-bg))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        navy: {
          50: "hsl(222 60% 95%)",
          100: "hsl(222 55% 88%)",
          200: "hsl(222 60% 75%)",
          300: "hsl(222 65% 55%)",
          400: "hsl(222 68% 40%)",
          500: "hsl(222 70% 30%)",
          600: "hsl(222 70% 20%)",
          700: "hsl(222 70% 14%)",
          800: "hsl(222 70% 10%)",
          900: "hsl(222 70% 7%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "score-ring": {
          from: { "stroke-dashoffset": "283" },
          to: { "stroke-dashoffset": "0" },
        },
        "slide-in": {
          from: { transform: "translateX(30px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bar-wave": {
          "0%, 100%": { height: "4px" },
          "50%": { height: "100%" },
        },
        "risk-fill": {
          from: { width: "0%" },
          to: { width: "var(--risk-width)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "score-ring": "score-ring 1.5s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "bar-wave": "bar-wave 0.8s ease-in-out infinite",
        "risk-fill": "risk-fill 1.5s ease-out forwards",
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-emerald": "var(--gradient-emerald)",
      },
      boxShadow: {
        "glow-emerald": "var(--shadow-glow-emerald)",
        "glow-navy": "var(--shadow-glow-navy)",
        card: "var(--shadow-md)",
        "card-lg": "var(--shadow-lg)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
