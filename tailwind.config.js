/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#000',
          800: '#1A1A1A',
        },
        gold: {
          400: '#FFD700',
          500: '#FFC300',
        },
      },
      fontFamily: {
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #FFD700 0%, #FFC300 100%)',
      },
      // Only keep minimal, essential animation
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
  corePlugins: {
    // Only keep essential core plugins
    preflight: true,
    container: true,
    // Disable accessibility, aspectRatio, etc. for smaller output
    accessibility: false,
    aspectRatio: false,
    float: false,
    clear: false,
    // ...add more disables as needed for your project
  },
};