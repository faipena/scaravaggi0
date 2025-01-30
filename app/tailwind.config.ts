import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        godzilla: ["Godzilla", "sans-serif"],
      },
    },
  },
} satisfies Config;
