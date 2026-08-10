/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './resources/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f3ff',
          100: '#ebe9fe',
          500: '#6366f1',
          600: '#4F52E6',
          700: '#4345D9',
          900: '#1e1b4b',
        },
        cream: {
          50: '#FAF9F5',
          100: '#F5F3ED',
          200: '#EBE8DF',
        },
        darkNav: '#0B0F19',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
        'floating': '0 24px 50px -10px rgba(65, 61, 122, 0.12)',
      }
    },
  },
  plugins: [],
}
