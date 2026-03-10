/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c1a4c',
          light: '#3d2469',
        },
        'background-light': '#f7f6f8',
        'background-dark': '#18141e',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      height: {
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '28': '7rem',
      },
      boxShadow: {
        'primary': '0 4px 14px 0 rgba(44, 26, 76, 0.2)',
      }
    },
  },
  plugins: [],
}
