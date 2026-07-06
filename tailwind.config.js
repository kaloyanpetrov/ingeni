module.exports = {
  content: ['./index.html', './the-longevity-store.html'],
  theme: {
    extend: {
      colors: {
        sand: {
          900: '#D9D2C5',
          800: '#EDEAE4',
          700: '#E3DED5',
          600: '#D9D2C5',
          500: '#C4BCB0',
          400: '#B8AFA2',
          300: '#8C8C8C',
          200: '#6B6B6B',
          100: '#3D3D3D',
          50: '#1A1A1A'
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        ingeni: ['Ingeni', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px'
      }
    }
  },
  plugins: []
};
