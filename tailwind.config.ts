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
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          900: '#0a1128',
          800: '#121e3f',
          700: '#1c2e5b',
        },
        champagne: {
          500: '#d4af37',
          400: '#e5c158',
          300: '#f1d570',
        },
        offwhite: '#f9f9f9',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
