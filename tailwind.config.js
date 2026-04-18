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
        'space-dark': '#1a1a2e',
        'space-darker': '#16162a',
        'space-accent': '#e94560',
      }
    },
  },
  plugins: [],
}
