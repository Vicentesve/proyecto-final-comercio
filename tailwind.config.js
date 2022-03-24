module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black_rgba: "rgba(0, 0, 0, 0.7)",
      },
      zIndex: {
        100: "100",
        90: "90",
        80: "80",
        70: "70",
        60: "60",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
