import { transform } from "next/dist/build/swc/generated-native";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    animation: {
      pulse: "pulse 1.5s linear infinite",
      open: "open 0.3s forwards",
      loading: "loading .5s linear infinite",
    },
    keyframes: {
      pulse: {
        "0%": {
          opacity: "0.5",
        },
        "50%": {
          opacity: "1",
        },
        "100%": {
          opacity: "0.5",
        },
      },
      open: {
        "0%": {
          transform: "scale(0) translate(-50%, -50%)",
        },
        "100%": {
          transform: "scale(1) translate(-50%, -50%)",
        },
      },
      loading: {
        "0%": {
          transform: "rotate(0deg)",
        },
        "100%": {
          transform: "rotate(360deg)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
