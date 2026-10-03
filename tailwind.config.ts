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
      dropShadow: {
        window: "3px 9px 15px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
