const withMT = require("@material-tailwind/react/utils/withMT");
const { join } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  content: [
    join(__dirname, "src/**/*.{js,ts,jsx,tsx,html}"),
    join(__dirname, "pages/**/*.{js,ts,jsx,tsx,html}"),
    join(__dirname, "components/**/*.{js,ts,jsx,tsx,html}"),
    join(__dirname, "app/**/*.{js,ts,jsx,tsx,html}"),
  ],
  theme: {
    extend: {
      fontFamily: {
        lobster: ['Lobster', 'cursive'],
        title: ['Playfair Display', 'serif'],
        description: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
  ],
});