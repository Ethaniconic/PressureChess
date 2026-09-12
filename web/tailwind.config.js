/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070B14',
          900: '#0B1120',
          850: '#0F172A',
          800: '#141E33',
          700: '#1E293B',
          600: '#334155',
        },
        cyan: {
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          brand: '#00E5FF',
          glow: '#38BDF8',
        },
        gold: {
          400: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
          accent: '#FBBF24',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          accent: '#059669',
        },
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(0, 229, 255, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
