/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // for root html file
    "./src/**/*.{js,jsx,ts,tsx}", // for React/TSX files
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

