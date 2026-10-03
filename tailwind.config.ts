import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        stardust: ['"PF Stardust"', '"PF Stardust Bold"', "sans-serif"],
        "stardust-bold": ['"PF Stardust Bold"', '"PF Stardust"', "sans-serif"],
        starshines: ["Starshines", '"PF Stardust Bold"', "sans-serif"],
      },
      colors: {
        cocoa: "#5b4a43",
      },
    },
  },
  plugins: [],
};

export default config;
