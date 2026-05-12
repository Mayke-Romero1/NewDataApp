/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde7ff',
          200: '#c3d2ff',
          300: '#9db4ff',
          400: '#748bff',
          500: '#4f63f7',
          600: '#3a46eb',
          700: '#2e37cf',
          800: '#2830a8',
          900: '#252d84',
          950: '#161954',
        },
        surface: {
          DEFAULT: '#0d0f1a',
          50:  '#f8f9fc',
          100: '#eef0f7',
          200: '#d8dced',
          300: '#b5bcd8',
          400: '#8b93b8',
          500: '#6b7399',
          600: '#555d80',
          700: '#454c6a',
          800: '#3b4059',
          900: '#343950',
          950: '#0d0f1a',
        },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
