/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(180deg, rgba(0,168,255,1) 0%, rgba(108,73,205,1) 68%)',
      },
    },
  },
  plugins: [],
}

