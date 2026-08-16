import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a",
          foreground: "#ffffff",
        },

        secondary: {
          DEFAULT: "#2563eb",
          foreground: "#ffffff",
        },

        accent: {
          DEFAULT: "#16a34a",
          foreground: "#ffffff",
        },

        marketplace: {
          background: "#f8fafc",
          card: "#ffffff",
          border: "#e2e8f0",
        },
      },

      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        enterprise:
          "0 10px 30px rgba(15,23,42,0.08)",
      },

      animation: {
        "fade-in":
          "fadeIn 0.3s ease-in-out",

        "slide-up":
          "slideUp 0.3s ease-out",
      },

      keyframes: {

        fadeIn: {
          from: {
            opacity: "0",
          },

          to: {
            opacity: "1",
          },
        },


        slideUp: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },

          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

      },
    },
  },

  plugins: [],
};

export default config;
