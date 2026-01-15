/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9f5',
          100: '#e1f3e9',
          200: '#c3e8d5',
          300: '#95d6b8',
          400: '#52b788', // Base color from site
          500: '#40916c',
          600: '#2d6a4f',
          700: '#2d5016', // Dark green from site
          800: '#1a3d0a', // Very dark green from site
          900: '#0f2306',
        },
      },
    },
  },
  plugins: [],
}