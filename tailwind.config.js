/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep "charge core" navy — primary brand color
        core: {
          50: '#EEF1F7',
          100: '#D6DDEC',
          200: '#AEBBD9',
          300: '#8598C1',
          400: '#5C74A3',
          500: '#3D5480',
          600: '#2A3D63',
          700: '#1B2A4A',
          800: '#141F38',
          900: '#0D1526',
        },
        // "Charge spark" amber — accent for in-progress/active states
        spark: {
          50: '#FEF6E7',
          100: '#FDEAC2',
          200: '#FBD98A',
          300: '#F9C452',
          400: '#F5A623',
          500: '#D88C0A',
          600: '#B06F06',
        },
        surface: '#FFFFFF',
        canvas: '#F6F7F9',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(13, 21, 38, 0.04), 0 4px 12px rgba(13, 21, 38, 0.05)',
        'card-hover': '0 2px 4px rgba(13, 21, 38, 0.06), 0 8px 24px rgba(13, 21, 38, 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
