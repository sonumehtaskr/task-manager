/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'thinBlack': '#f2f4f8',
        'lightBlack': '#abb4c2',
        'darkBlack': '#2d3346',
        'darkPurple': '#3c37ff'
      },
    },
  },
  plugins: [],
}