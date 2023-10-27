import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "home-bkg": "url('/src/assets')",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
