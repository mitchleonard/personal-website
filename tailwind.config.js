/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'near-black': '#0f0f0f',
        'off-white': '#f7f5f2',
        'accent': '#C27D38',
      },
    },
  },
  plugins: [],
}
