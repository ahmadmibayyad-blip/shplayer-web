/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind');
const { addIconSelectors } = require('@iconify/tailwind');

export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./index.html",
     "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9', // blue
        accent: '#FF7A18', // orange
        dark: '#000000'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    addDynamicIconSelectors(),
    addIconSelectors(['mdi', 'mdi-light']),
    require('@iconify/tailwind'),
  ],
}

