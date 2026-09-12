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
          950: '#080808',
          900: '#0E0E0E',
          850: '#141414',
          800: '#1A1A1A',
          700: '#262626',
          600: '#383838',
        },
        slate: {
          950: '#080808',
          900: '#101114',
          850: '#141519',
          800: '#18191E',
          750: '#1E2026',
          700: '#262830',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8',
          200: '#E4E4E7',
          100: '#F4F4F5',
          50: '#FAFAFA',
        },
        cyan: {
          300: '#F5C86C',
          400: '#E5A93C',
          500: '#D4AF37',
          brand: '#E5A93C', // Royal Gold replacing blue cyan brand
          glow: '#F3D270',
        },
        gold: {
          400: '#F5C86C',
          500: '#E5A93C',
          600: '#B87F1C',
          accent: '#D4AF37',
        },
        emerald: {
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          accent: '#15803D',
        },
        indigo: {
          500: '#A855F7',
          600: '#9333EA',
        }
      },
      borderRadius: {
        none: '0px',
        sm: '3px',
        DEFAULT: '4px',
        md: '4px',
        lg: '5px',
        xl: '5px',
        '2xl': '5px',
        '3xl': '5px',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(229, 169, 60, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(34, 197, 94, 0.35)',
        'glow-gold': '0 0 25px -5px rgba(229, 169, 60, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.75)',
      }
    },
  },
  plugins: [],
}
