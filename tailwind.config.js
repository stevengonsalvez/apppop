module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        '.btn-primary': {
          '@apply bg-black text-white py-3 rounded-lg text-center font-extrabold': {},
        },
        '.btn-secondary': {
          '@apply bg-white text-black py-3 rounded-lg text-center font-extrabold': {},
        }
      });
    },
  ],
};