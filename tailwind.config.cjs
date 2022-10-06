/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,tsx,ts}',
    './index.html',
    'public/404.html'
  ],
  theme: {
    extend: {
      colors: {
        blackpink: {
          50: '#c75acc',
          500: '#8b0077',
          400: '#9612eb',
          600: '#8b31d6',
          700: '#6a24a6',
          800: '#8b31d6',
        },
        lightred: {
          50: '#ddd6f3',
          100: '#faaca8',
        }
      }
    },
  },
  plugins: [],
}