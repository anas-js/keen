import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // ...
    // make sure it's pointing to the ROOT node_module
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes : {
      light : {
        colors : {
          primary : {
            DEFAULT : "#7AE2CF",
          },
          secondary : {
             DEFAULT : "#077A7D"
          }
        }
      }
    }
  })]
}

export default config;