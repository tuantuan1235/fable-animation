/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fable: {
          50: '#FFF8E7',
          100: '#FFEFC3',
          200: '#FFE08A',
          300: '#FFD24D',
          400: '#FFC833',
          500: '#FFB800',
          600: '#CC9300',
          700: '#996E00',
          800: '#664A00',
          900: '#332500',
        },
      },
    },
  },
  plugins: [],
};
