/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["PlusJakartaSans-Regular", "sans-serif"],
        "rubik-bold": ["PlusJakartaSans-Bold", "sans-serif"],
        "rubik-extrabold": ["PlusJakartaSans-ExtraBold", "sans-serif"],
        "rubik-medium": ["PlusJakartaSans-Medium", "sans-serif"],
        "rubik-semibold": ["PlusJakartaSans-SemiBold", "sans-serif"],
        "rubik-light": ["PlusJakartaSans-Light", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#0061FF0A",
          200: "#0061FF1A",
          300: "#0061FF",
        },
        accent: {
          100: "#FBFBFD",
        },
        black: {
          DEFAULT: "#000000",
          100: "#8C8E98",
          200: "#666876",
          300: "#191D31",
        },
        danger: "#F75555",
      },
    },
  },
  plugins: [],
};
