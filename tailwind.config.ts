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
          900: '#111111', // Deep Charcoal (Replacing old 0A1128)
          800: '#1a1a1a', // Rich off-black
          700: '#262626', // Lighter grey
        },
        champagne: {
          700: '#A88523', // Dark gold for high contrast text
          600: '#C5A02E', // Darker gold hover
          500: '#D4AF37', // True Antique Gold
          400: '#E6C762', // Lighter gold hover
          300: '#F3E19C', // Faint gold 
        },
        offwhite: '#FAFAFA',
      },
      fontFamily: {
        playfair: ['var(--font-cormorant)', 'serif'], // Swapped Playfair for Cormorant Garamond for higher-end editorial feel
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
