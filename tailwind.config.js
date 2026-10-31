/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F4EFE4',
          surface: '#F4EFE4',
          card: '#FBF8F0',
        },
        ink: {
          DEFAULT: '#0A1714',
          muted: '#52605D',
        },
        teal: {
          action: '#0B6B62',
          hover: '#08534C',
          light: '#E6F3F1',
        },
        gold: {
          highlight: '#E3B341',
          light: '#FCF5E2',
        },
        danger: {
          DEFAULT: '#8C2F2F',
          light: '#FCEBEB',
        },
        dropgreen: {
          DEFAULT: '#167E51',
          light: '#EBF7F0',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Arial', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(10, 23, 20, 0.05), 0 1px 3px rgba(10, 23, 20, 0.03)',
        'float': '0 8px 24px -4px rgba(10, 23, 20, 0.15)',
      }
    },
  },
  plugins: [],
}
