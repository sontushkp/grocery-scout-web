/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        jade: {
          50: '#f0fdf5',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#10b981',
          700: '#15803c',
          800: '#166533',
          900: '#14532b',
          950: '#052e16'
        }
      },
      backgroundColor: {
        'jade-600': 'var(--color-primary)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      },
      textColor: {
        'jade-600': 'var(--color-primary)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      },
      borderColor: {
        'jade-600': 'var(--color-primary)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      },
      ringColor: {
        'jade-600': 'var(--color-primary)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)'
      },
      fontFamily: {
        sans: ['var(--font-family)', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: 'var(--button-radius)'
      },
      maxWidth: {
        container: 'var(--container-max-width)'
      },
      screens: {
        'hover-hover': { raw: '(hover: hover)' }
      },
      transitionDuration: {
        DEFAULT: '200ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
