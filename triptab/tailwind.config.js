/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: {
          50:  '#F1F5F9',
          100: '#E2E8F0',
          200: '#94A3B8',
          300: '#64748B',
          400: '#3D4A5C',
          500: '#252F40',
          600: '#1A2230',
          700: '#121926',
          800: '#0C111B',
          900: '#080D14',
        },
        amber: {
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        violet: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        rose: {
          400: '#FB7185',
          500: '#F43F5E',
        },
      },
      boxShadow: {
        'card':         '0 2px 8px rgba(0,0,0,0.5)',
        'card-hover':   '0 4px 16px rgba(0,0,0,0.6)',
        'glow-amber':   '0 0 24px rgba(245,158,11,0.2)',
        'glow-violet':  '0 0 24px rgba(139,92,246,0.2)',
        'glow-emerald': '0 0 24px rgba(52,211,153,0.15)',
      },
    },
  },
  plugins: [],
}
