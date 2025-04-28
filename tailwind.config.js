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
    },
  },
  plugins: [],
};