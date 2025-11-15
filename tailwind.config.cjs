/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      // Define custom font families here
      fontFamily: {
        // Creates the 'font-audiowide' utility class for titles
        audiowide: ["Audiowide", "sans-serif"],

        // Creates the 'font-quicksand' utility class for subtitles/body text
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};
