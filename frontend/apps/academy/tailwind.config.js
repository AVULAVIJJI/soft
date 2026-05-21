/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0066FF', 50: '#EBF2FF', 100: '#D6E4FF', 500: '#0066FF', 600: '#0055DD', 700: '#0044BB' },
        dark: { DEFAULT: '#050C1A', surface: '#0D1730', border: '#1A2740' },
        gold: { DEFAULT: '#FFB800' },
      },
      fontFamily: { sans: ['var(--font-dm-sans)', 'sans-serif'], display: ['var(--font-syne)', 'sans-serif'] },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
