/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0f0f1a',
          800: '#1a1a2e',
          700: '#252542',
          600: '#303055',
          500: '#3f3f6e',
          400: '#5a5a8a',
          300: '#7a7aa8',
          200: '#a0a0c8',
          100: '#d0d0e8',
        },
        accent: {
          cyan: '#00d4ff',
          purple: '#9d4edd',
          gold: '#ffd700',
          green: '#00ff88',
          red: '#ff4444',
          orange: '#ff8800',
          yellow: '#ffdd00',
        },
        star: {
          white: '#ffffff',
          silver: '#c0c0c0',
          gold: '#ffd700',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          '100%': { boxShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff' },
        },
      },
    },
  },
  plugins: [],
}