/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#4db6ac',
          dark: '#00897b',
          light: '#e0f2f1',
        },
      },
    },
  },
  plugins: [],
}
