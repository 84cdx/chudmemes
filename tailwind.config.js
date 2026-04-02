/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Dark Mode by default
  theme: {
    extend: {
      colors: {
        'miku-cyan': {
          DEFAULT: '#39C5BB',
          hover: '#2fb0a6',
          glow: 'rgba(57, 197, 187, 0.4)'
        },
      },
      fontFamily: {
        impact: ['Impact', 'Arial Black', 'sans-serif'],
      },
      boxShadow: {
        'miku-glow': '0 0 20px rgba(57, 197, 187, 0.5)',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.meme-text': {
          'font-family': 'Impact, "Arial Narrow Bold", sans-serif',
          'color': 'white',
          'text-transform': 'uppercase',
          '-webkit-text-stroke': '8px black',
          'paint-order': 'stroke fill',
          'text-shadow': '0 0 6px #000, 0 0 6px #000, 0 0 6px #000',
        },
        '.glassmorphism': {
          'background': 'rgba(255, 255, 255, 0.05)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        }
      });
    }
  ],
}
