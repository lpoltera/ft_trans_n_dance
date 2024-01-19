import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  plugins: [formsPlugin],
} satisfies Config;
