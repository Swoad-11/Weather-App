/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      colors: {
        body: "#1D1E28",
        light: "#fff",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0 }, to: { opacity: 1 } },
        rise: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: 0, transform: "translateY(10px) scale(.97)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        pop: {
          from: { opacity: 0, transform: "translateY(-6px) scale(.98)" },
          to: { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        heart: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease-out both",
        rise: "rise .5s cubic-bezier(.2,.7,.2,1) both",
        "slide-up": "slide-up .25s ease-out both",
        pop: "pop .18s ease-out both",
        float: "float 5s ease-in-out infinite",
        heart: "heart .35s ease-out",
      },
    },
  },
  plugins: [],
};
