import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/index.tsx',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#2A3655",
          secondary: "#8B45FD",
          "secondary-content": "#7800FF",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          // "base-300": "#ffffff",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--bg-border": "#708090",
          ".bg-gradient-modal": {
            "background-image":
              "linear-gradient(270deg, #A7ECFF -17.42%, #E8B6FF 109.05%)",
          },
          ".bg-modal": {
            background:
              "linear-gradient(270deg, #ece9fb -17.42%, #e3f4fd 109.05%)",
          },
          ".modal-border": {
            border: "1px solid #5c4fe5",
          },
          ".bg-gradient-nav": {
            background: "#000000",
          },
          ".bg-main": {
            background: "#FFFFFF",
          },
          ".bg-underline": {
            background:
              "linear-gradient(270deg, #A7ECFF -17.42%, #E8B6FF 109.05%)",
          },
          ".bg-container": {
            background: "transparent",
          },
          ".bg-btn-mint": {
            "background-image":
              "linear-gradient(270deg, #FFB6C1 -17.42%, #7FFFAA 109.05%)",
          },
        },
      },
      {
        dark: {
          primary: "#212638",
          "primary-content": "#DAE8FF",
          secondary: "#8b45fd",
          "secondary-content": "#0FF",
          accent: "#4969A6",
          "accent-content": "#F9FBFF",
          neutral: "#F9FBFF",
          "neutral-content": "#385183",
          "base-100": "#1C223B",
          "base-200": "#2A3655",
          "base-300": "#141a30",
          "base-content": "#F9FBFF",
          info: "#385183",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",
          "--bg-border": "#DDE6EE",
          ".bg-gradient-modal": {
            background: "#385183",
          },
          ".bg-modal": {
            background: "linear-gradient(90deg, #2B2243 0%, #253751 100%)",
          },
          ".modal-border": {
            border: "1px solid #4f4ab7",
          },
          ".bg-gradient-nav": {
            "background-image":
              "var(--gradient, linear-gradient(90deg, #42D2F1 0%, #B248DD 100%))",
          },
          ".bg-main": {
            background: "#000000",
          },
          ".bg-underline": {
            background: "#5368B4",
          },
          ".bg-container": {
            background: "#141a30",
          },
          ".bg-btn-mint": {
            "background-image":
              "linear-gradient(180deg, #3457D1 0%, #8A45FC 100%)",
          },
        },
      }
    ],
    // themes: ["light", "dark"]
  },
};
export default config;
