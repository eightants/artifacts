/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this line to match your file extensions
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--palette-color-border) / <alpha-value>)",
        primaryText: "hsl(var(--palette-color-primary-text) / <alpha-value>)",
        secondaryText:
          "hsl(var(--palette-color-secondary-text) / <alpha-value>)",
        hover: "hsl(0 0% 75% / 0.15)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--palette-color-primary) / <alpha-value>)",
          foreground: "hsl(var(--palette-color-primary) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--palette-color-secondary) / <alpha-value>)",
          foreground: "hsl(var(--palette-color-secondary) / <alpha-value>)",
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
          DEFAULT: "hsl(var(--palette-color-accent) / <alpha-value>)",
          foreground: "hsl(var(--palette-color-accent) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [],
};
