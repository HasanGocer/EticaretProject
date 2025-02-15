/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // React, Next.js, Vite vb. için
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./index.html", // HTML projesi için
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
