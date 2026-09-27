import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { espresso: "rgb(42 26 18 / <alpha-value>)", accent: "rgb(194 65 12 / <alpha-value>)", cream: "rgb(247 241 232 / <alpha-value>)", mocha: "rgb(107 74 53 / <alpha-value>)" }, fontFamily: { sans: ["var(--font-poppins)", "system-ui", "sans-serif"], serif: ["var(--font-lora)", "Georgia", "serif"] } } },
  plugins: [],
};
export default config;
