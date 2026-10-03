import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        stardust: ['"PF Stardust"', "sans-serif"],
        kiwi: ["KiwiSoda", "sans-serif"],
        meow: ['"Ownglyph MeowWriting"', "sans-serif"],
        jinpall: ['"Ownglyph Jinpall"', "sans-serif"],
        dinaru: ["UnDinaru", "serif"],
        essay: ["StardustEssay", "sans-serif"],
      },
      colors: {
        cocoa: "#5b4a43",
        taupe: "#bfb1a8",
        candy: "#ff9ccf",
        blush: "#fff2f9",
        mist: "#ebebed",
        mint: "#f1ffff",
        petal: "#ffcbe7",
        chocolate: "#644542",
        cream: "#fff9fc",
      },
      fontSize: {
        body: ["34.73px", { lineHeight: "34px", letterSpacing: "-0.87px" }],
      },
      keyframes: {
        "frame-first": {
          "0%, 49.99%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "frame-second": {
          "0%, 49.99%": { opacity: "0" },
          "50%, 100%": { opacity: "1" },
        },
      },
      animation: {
        "frame-first": "frame-first 2.4s steps(1) infinite",
        "frame-second": "frame-second 2.4s steps(1) infinite",
      },
      dropShadow: {
        window: "3px 9px 15px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
