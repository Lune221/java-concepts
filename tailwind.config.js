/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDF0EC",
        surface: "#F7F9F6",
        ink: "#1B2420",
        muted: "#5F6B64",
        rule: "#D2D9D1",
        cobalt: "#2B4CF2",
        oxide: "#B8442E",
        moss: "#3E7A4F",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
