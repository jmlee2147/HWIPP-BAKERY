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
        pretendard: ["Pretendard", "sans-serif"],
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
        "touch-ring": {
          from: { opacity: "0.8", transform: "scale(0.25)" },
          to: { opacity: "0", transform: "scale(1)" },
        },
        "plate-drift": {
          to: { transform: "translate(-57.15px, -74.42px)" },
        },
        "window-pop": {
          from: { opacity: "0", transform: "scale(0.2)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "name-highlight-fade": {
          "0%, 45%": { opacity: "1" },
          "58%, 99%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "name-highlight-sweep": {
          "0%": { transform: "translateX(-101%)" },
          "18%, 58%": { transform: "translateX(0)" },
          "59%, 100%": { transform: "translateX(-101%)" },
        },
        "name-highlight-hold": {
          "0%": { transform: "translateX(101%)" },
          "18%, 58%": { transform: "translateX(0)" },
          "59%, 100%": { transform: "translateX(101%)" },
        },
        shimmer: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(167%)" },
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
        "touch-ring": "touch-ring 0.5s ease-out both",
        "window-pop": "window-pop 0.35s ease-out both",
        "name-highlight-fade": "name-highlight-fade 6s ease-in-out infinite",
        "name-highlight-sweep": "name-highlight-sweep 6s ease-in-out infinite",
        "name-highlight-hold": "name-highlight-hold 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite alternate",
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
