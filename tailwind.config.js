/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          indigo: 'rgba(99, 102, 241, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
        'live-pulse': 'livePulse 2.2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
        'scale-up': 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        livePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.4)' },
          '50%': { transform: 'scale(1.15)', opacity: '0.85', boxShadow: '0 0 8px 3px rgba(16, 185, 129, 0.25)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(0.97)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(120%) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
