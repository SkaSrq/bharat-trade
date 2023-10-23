/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#5200cc",
        brand10: "#140033",
        brand20: "#290066",
        brand35: "#4700b3",
        brand45: "#5c00e6",
        brand80: "#c299ff",
        brand95: "#f0e6ff",
        lightBlue35: "#0059b3",
        lightBlue50: "#0080ff",
        lightBlue60: "#3399ff",
        white: "#ffffff",
        grey: "#6C6D83",
      },
    },
  },
  plugins: [],
};
