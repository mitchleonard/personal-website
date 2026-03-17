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
        // New palette — replaces old amber accent
        'accent': '#006fab',          // Cornflower Ocean — primary CTA, links, labels
        'cornflower': '#006fab',      // alias
        'frozen-lake': '#85d4ff',     // light blue — backgrounds, chips
        'tangerine': '#f56e3d',       // Atomic Tangerine — warm highlights, hover
        'banana': '#fde74c',          // Banana Cream — tags, callout chips
        'yellow-green': '#9bc53d',    // Yellow Green — results, metrics, impact
      },
    },
  },
  plugins: [],
}
