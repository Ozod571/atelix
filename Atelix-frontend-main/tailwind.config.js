const SF = [
  "-apple-system",
  "BlinkMacSystemFont",
  "SF Pro Display",
  "SF Pro Text",
  "var(--font-inter)",
  "Inter",
  "Segoe UI",
  "system-ui",
  "sans-serif",
];

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: SF,
        display: SF,
      },
      colors: {
        ink: {
          900: "rgb(var(--ink-900) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
          200: "rgb(var(--ink-200) / <alpha-value>)",
          100: "rgb(var(--ink-100) / <alpha-value>)",
          50: "rgb(var(--ink-50) / <alpha-value>)",
        },
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          600: "rgb(var(--accent-600) / <alpha-value>)",
          fg: "rgb(var(--accent-fg) / <alpha-value>)",
        },
        info: "rgb(var(--blue) / <alpha-value>)",
        teal: "rgb(var(--teal) / <alpha-value>)",
        success: "rgb(var(--green) / <alpha-value>)",
        warning: "rgb(var(--orange) / <alpha-value>)",
        danger: "rgb(var(--red) / <alpha-value>)",
        pink: "rgb(var(--pink) / <alpha-value>)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "22px",
        "4xl": "30px",
        "5xl": "34px",
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(0.2, 0.7, 0.2, 1)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
