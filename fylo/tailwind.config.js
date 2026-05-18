/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        'fylo-dark-blue':       '#1c2431',
        'fylo-dark-blue-2':     '#181f2a',
        'fylo-dark-blue-3':     '#202a3c',
        'fylo-desaturated-blue':'#585989',
        'fylo-cyan':            '#65e2d9',
        'fylo-blue':            '#339ecc',
        'fylo-error':           '#ff4242',
      },
      fontFamily: {
        sans:    ['"Open Sans"', 'sans-serif'],
        heading: ['"Raleway"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
