/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#2857C4",
        teal: "#38BDB1",
        surface: "#F2F2F2",
        ink: "#0F172A",
        "navy-deep": "#020617",
        "navy-medium": "#020c1a",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.16)",
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
