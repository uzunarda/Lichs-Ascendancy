/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:    { DEFAULT: '#d4af37', dim: '#8a6d1a' },
        purple:  { DEFAULT: '#4a1e6b', light: '#7c3aad', dim: '#2a0f3d' },
        blood:   { DEFAULT: '#8b1a1a', light: '#c0392b' },
        dark:    { DEFAULT: '#080408' },
        mid:     { DEFAULT: '#12081a' },
        surface: { DEFAULT: 'rgba(18,8,26,0.85)', hover: 'rgba(30,12,44,0.95)' },
        border:  { DEFAULT: 'rgba(212,175,55,0.2)', hover: 'rgba(212,175,55,0.5)' },
        ink:     { DEFAULT: '#fef9ec', dim: '#a09faf' },
        green:   { DEFAULT: '#3a7a4a' },
        void:    { DEFAULT: '#a78bfa' },
      },
      fontFamily: {
        cinzel:  ['"Cormorant SC"', 'serif'],
        crimson: ['"Alegreya Sans"', 'sans-serif'],
      },
      boxShadow: {
        gold:   '0 0 12px rgba(212,175,55,0.5)',
        'gold-lg': '0 0 24px rgba(212,175,55,0.7)',
        blood:  '0 0 12px rgba(192,57,43,0.4)',
        'blood-lg': '0 0 24px rgba(192,57,43,0.7)',
        void:   '0 0 12px rgba(167,139,250,0.5)',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
};