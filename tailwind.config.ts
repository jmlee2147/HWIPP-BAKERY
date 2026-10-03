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
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "70%": { opacity: "1", transform: "scale(1.12)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        "plate-drift": {
          to: { transform: "translate(-57.15px, -74.42px)" },
        },
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
        "pop-in": "pop-in 0.45s ease-out both",
        bob: "bob 3s ease-in-out infinite",
        wobble: "wobble 3s ease-in-out infinite",
        "plate-drift": "plate-drift 5s linear infinite",
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
