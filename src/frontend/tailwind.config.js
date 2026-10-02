import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        header: "oklch(var(--header-background))",
        foreground: "oklch(var(--foreground))",
        surface: {
          DEFAULT: "oklch(var(--surface))",
          elevated: "oklch(var(--surface-elevated))",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
          background: "oklch(var(--card-background))",
        },
        info: {
          DEFAULT: "oklch(var(--info) / <alpha-value>)",
          foreground: "oklch(var(--info-foreground))",
        },
        success: {
          DEFAULT: "oklch(var(--success) / <alpha-value>)",
          foreground: "oklch(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "oklch(var(--warning) / <alpha-value>)",
          foreground: "oklch(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "oklch(var(--danger) / <alpha-value>)",
          foreground: "oklch(var(--danger-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar) / <alpha-value>)",
          foreground: "oklch(var(--sidebar-foreground) / <alpha-value>)",
          primary: "oklch(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "oklch(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "oklch(var(--sidebar-border) / <alpha-value>)",
          ring: "oklch(var(--sidebar-ring) / <alpha-value>)",
          muted: "oklch(var(--sidebar-muted) / <alpha-value>)",
          "muted-foreground": "oklch(var(--sidebar-muted-foreground) / <alpha-value>)",
          "active-bg": "oklch(var(--sidebar-active-bg) / <alpha-value>)",
          "active-indicator": "oklch(var(--sidebar-active-indicator))",
          "active-background": "oklch(var(--sidebar-active-background))",
          "active-foreground": "oklch(var(--sidebar-active-foreground))",
          "hover-background": "oklch(var(--sidebar-hover-background))",
        },
      },
      maxWidth: {
        content: "var(--content-max-width)",
      },
      minWidth: {
        "board-col": "var(--board-col-min-width)",
        "detail-panel": "var(--detail-panel-min-width)",
      },
      height: {
        "header-height": "var(--header-height)",
        "stats-bar": "var(--stats-bar-height)",
        "action-bar": "var(--action-bar-height)",
        "tab-strip": "var(--tab-strip-height)",
        row: "var(--row-height)",
        "row-compact": "var(--row-height-compact)",
        input: "var(--input-height)",
      },
      top: {
        "action-bar": "var(--action-bar-height)",
        header: "var(--header-height)",
      },
      zIndex: {
        base: "var(--z-base)",
        sticky: "var(--z-sticky)",
        fixed: "var(--z-fixed)",
        overlay: "var(--z-overlay)",
        popover: "var(--z-popover)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
      },
      width: {
        "sidebar-width": "var(--sidebar-width)",
        "sidebar-collapsed": "var(--sidebar-width-collapsed)",
        "list-panel": "var(--list-panel-width)",
      },
      padding: {
        "row-y": "var(--row-padding-y)",
        "row-x": "var(--row-padding-x)",
        "card-inner": "var(--card-padding)",
        content: "var(--content-padding)",
        page: "var(--content-padding)",
        card: "var(--padding-card)",
      },
      spacing: {
        "row-px": "var(--row-padding-x)",
        "row-py": "var(--row-padding-y)",
        "card-pad": "var(--card-padding)",
        "section-gap": "var(--section-gap)",
        "component-gap": "var(--component-gap)",
        "gap-tight": "var(--gap-tight)",
        "gap-base": "var(--gap-base)",
        "gap-loose": "var(--gap-loose)",
        "icon-btn": "var(--icon-btn-size)",
        "space-1": "var(--space-1)",
        "space-2": "var(--space-2)",
        "space-3": "var(--space-3)",
        "space-4": "var(--space-4)",
        "space-5": "var(--space-5)",
        "space-6": "var(--space-6)",
        "space-8": "var(--space-8)",
        "space-10": "var(--space-10)",
        "space-12": "var(--space-12)",
        "content-padding": "var(--content-padding)",
        "padding-card": "var(--padding-card)",
        "padding-section": "var(--padding-section)",
        "gap-form": "var(--gap-form)",
      },
      borderRadius: {
        full: "var(--radius-full)",
        lg: "var(--radius-lg)",
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        md: "var(--radius)",
      },
      boxShadow: {
        xs: "var(--shadow-sm)",
        sm: "var(--shadow-sm)",
        card: "var(--shadow)",
        elevated: "var(--shadow-md)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionDuration: {
        DEFAULT: "var(--duration-base)",
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in var(--duration-fast) ease-out",
        "fade-out": "fade-out var(--duration-fast) ease-out",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
