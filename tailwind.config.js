const palette = require('./constants/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: palette.primary,
        secondary: palette.secondary,
      },
      fontFamily: {
        sans: ['Poppins_400Regular'], 
      },
    },
  },
  plugins: [],
};