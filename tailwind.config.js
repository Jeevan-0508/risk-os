/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#06080c',
          850: '#080b11',
          800: '#0a0e14',
          750: '#0e131b',
          700: '#131922',
          650: '#18202b',
          600: '#1e2733',
          550: '#26313f',
          500: '#33404f',
        },
        ink: {
          100: '#f2f5f9',
          200: '#d6dde7',
          300: '#a9b4c2',
          400: '#7d8a9b',
          500: '#5b6878',
        },
        threat: { DEFAULT: '#ff4d5e', dim: '#7a2530', glow: '#ff8a95' },
        attention: { DEFAULT: '#ffb020', dim: '#7a5410', glow: '#ffd07a' },
        controlled: { DEFAULT: '#00d68f', dim: '#0b5a41', glow: '#6fe9c4' },
        info: { DEFAULT: '#3b9cff', dim: '#153e6e', glow: '#8fc6ff' },
        strategic: { DEFAULT: '#a970ff', dim: '#3f2a6b', glow: '#c9a8ff' },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Cascadia Mono', 'Consolas', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
        scan: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 3px)',
      },
      backgroundSize: {
        grid: '32px 32px',
      },
      keyframes: {
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,77,94,0.45)' },
          '70%': { boxShadow: '0 0 0 8px rgba(255,77,94,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,77,94,0)' },
        },
        slideIn: {
          from: { transform: 'translateX(16px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          from: { transform: 'translateY(6px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2s ease-out infinite',
        slideIn: 'slideIn 180ms ease-out',
        fadeUp: 'fadeUp 220ms ease-out',
      },
    },
  },
  plugins: [],
};
