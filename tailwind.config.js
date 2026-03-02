/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          400: '#608bfb',
          500: '#3b63f7',
          600: '#2044eb',
        },
        surface: {
          1: '#0a0a0f',
          2: '#0f0f1a',
          3: '#141421',
          4: '#1a1a2e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%, 100%': { opacity: '0.3' }, '50%': { opacity: '0.7' } },
      },
    },
  },
  plugins: [],
}
