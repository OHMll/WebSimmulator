/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Home/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // เพิ่ม Poppins
      },
      animation: {
        bounceUp: "bounceUp 0.5s ease-out", // animation สำหรับการเด้ง
      },
      keyframes: {
        bounceUp: {
          "0%": { transform: "scale(0.5)", opacity: 0 },
          "50%": { transform: "scale(1.1)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
