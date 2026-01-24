/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        red: "#E81D1D",
        yellow: "#F5C125",
        greenLight: "#79E085",
        grey: "#D3D3D3",
      },
      fontFamily: {
        "roboto-thin": ["Roboto_100Thin"],
        roboto: ["Roboto_400Regular"],
        "roboto-bold": ["Roboto_700Bold"],
        sarala: ["Sarala_400Regular"],
        "sarala-bold": ["Sarala_700Bold"],
      },
    },
  },
  plugins: [],
};
