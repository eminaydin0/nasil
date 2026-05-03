/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Marka aksanı (mevcut orange/red tona alias)
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Sıcak beyaz / krem tonları (sayfa zeminleri için)
        cream: {
          50: '#fefdfb',
          100: '#fdfaf4',
          200: '#faf3e6',
          300: '#f5ead0',
        },
        // Sıcak gri (cool gri yerine - daha samimi his)
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Charcoal - gerçek siyah yerine sıcak koyu
        charcoal: {
          800: '#23201d',
          900: '#16140f',
          950: '#0d0c0a',
        },
        // Premium accent - amber/altın yıldızlar için
        accent: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px 0 rgba(28, 25, 23, 0.03)',
        'soft-md': '0 4px 6px -1px rgba(28, 25, 23, 0.06), 0 2px 4px -2px rgba(28, 25, 23, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(28, 25, 23, 0.08), 0 4px 6px -4px rgba(28, 25, 23, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
        'warm-glow': '0 10px 30px -10px rgba(249, 115, 22, 0.25)',
        'warm-glow-lg': '0 20px 50px -15px rgba(249, 115, 22, 0.35)',
        'inner-soft': 'inset 0 1px 2px 0 rgba(28, 25, 23, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s ease-out',
        'slow-fade': 'fadeIn 0.9s ease-out',
        'shimmer': 'shimmer 2s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'count-up': 'countUp 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
