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
        airbnb: {
          50: '#fff5f7',
          100: '#ffe9ee',
          200: '#ffcfd9',
          300: '#ffa6b8',
          400: '#ff6f8f',
          500: '#ff385c',
          600: '#e61e4d',
          700: '#c81541',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Sky Blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        }
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        air: '0 6px 24px rgba(0, 0, 0, 0.08)',
        'air-lg': '0 10px 32px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
