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
        // Channel triplets live in globals.css :root so ice cream mode
        // (html[data-icecream]) can re-theme every utility + opacity variant.
        'near-black': 'rgb(var(--c-near-black) / <alpha-value>)',   // #0f0f0f
        'off-white': 'rgb(var(--c-off-white) / <alpha-value>)',     // #f7f5f2
        'white': 'rgb(var(--c-white) / <alpha-value>)',             // #ffffff
        // New palette — replaces old amber accent
        'accent': 'rgb(var(--c-accent) / <alpha-value>)',           // #006fab Cornflower Ocean — primary CTA, links, labels
        'cornflower': 'rgb(var(--c-accent) / <alpha-value>)',       // alias
        'frozen-lake': 'rgb(var(--c-frozen-lake) / <alpha-value>)', // #85d4ff light blue — backgrounds, chips
        'tangerine': 'rgb(var(--c-tangerine) / <alpha-value>)',     // #f56e3d Atomic Tangerine — warm highlights, hover
        'banana': 'rgb(var(--c-banana) / <alpha-value>)',           // #fde74c Banana Cream — tags, callout chips
        'yellow-green': 'rgb(var(--c-yellow-green) / <alpha-value>)', // #9bc53d Yellow Green — results, metrics, impact
      },
    },
  },
  plugins: [],
}
