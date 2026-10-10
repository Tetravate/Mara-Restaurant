/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070706',
          900: '#0B0B0A',
          850: '#11100E',
          800: '#161412',
          750: '#1D1A17',
          700: '#26221E',
          600: '#38322C',
          500: '#524B43',
        },
        amber: {
          300: '#F5BE75',
          400: '#E6A15A',
          500: '#D8893E',
          600: '#C87532',
          700: '#A65A20',
          800: '#7C3F14',
          900: '#52280A',
        },
        ivory: {
          50: '#FDFBF7',
          100: '#F5F0E8',
          200: '#EBE4D8',
          300: '#DDD4C4',
          400: '#C8BEAC',
        },
        stone: {
          300: '#D6CEC2',
          400: '#B7AEA2',
          500: '#8C8275',
          600: '#675F54',
          700: '#4A443B',
        },
        sage: {
          400: '#6FA37D',
          500: '#4E7A5A',
          600: '#3D6146',
          700: '#2D4734',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 35px -5px rgba(216, 137, 62, 0.25)',
        'glow-subtle': '0 0 20px -3px rgba(216, 137, 62, 0.15)',
        'dark-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'floating': '0 20px 40px -15px rgba(0, 0, 0, 0.85)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
