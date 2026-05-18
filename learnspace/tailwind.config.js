/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#5b4ef8',
        'primary-dark': '#4a3de0',
        'primary-light': '#eef2ff',
        'primary-muted': '#f8f7ff',
        surface: '#ffffff',
        background: '#f4f4f8',
        border: '#ebebf5',
        'text-main': '#1a1a2e',
        'text-muted': '#888888',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}
