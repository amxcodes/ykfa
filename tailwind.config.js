/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark': {
          900: '#000000',
          800: '#1A1A1A',
          700: '#2C2C2C',
          600: '#3D3D3D',
        },
        'gold': {
          400: '#FFD700',
          500: '#FFC300',
        },
        success: {
          100: '#DCFCE7',
          500: '#22C55E',
          700: '#15803D',
        },
        warning: {
          100: '#FEF9C3',
          500: '#EAB308',
          700: '#A16207',
        },
        error: {
          100: '#FEE2E2',
          500: '#EF4444',
          700: '#B91C1C',
        },
      },
      fontFamily: {
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #FFD700 0%, #FFC300 100%)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(255, 215, 0, 0.5)',
      },
      keyframes: {
        'card-shuffle-out': {
          '0%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' },
          '100%': { transform: 'rotateY(90deg) scale(0.9)', opacity: '0' }
        },
        'card-shuffle-in': {
          '0%': { transform: 'rotateY(-90deg) scale(0.9)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' }
        },
        'card-slide-out': {
          '0%': { transform: 'translateX(0) scale(1) rotate(0)', opacity: '1' },
          '100%': { transform: 'translateX(-40%) scale(0.9) rotate(-5deg)', opacity: '0' }
        },
        'card-slide-in': {
          '0%': { transform: 'translateX(40%) scale(0.9) rotate(5deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) scale(1) rotate(0)', opacity: '1' }
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' }
        },
      },
      animation: {
        'card-shuffle-out': 'card-shuffle-out 0.6s ease-in-out forwards',
        'card-shuffle-in': 'card-shuffle-in 0.6s ease-in-out forwards',
        'card-slide-out': 'card-slide-out 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'card-slide-in': 'card-slide-in 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};