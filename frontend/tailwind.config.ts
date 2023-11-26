// import type { Config } from "tailwindcss";

// export default {
//   content: ["./src/**/*.{html,ts,tsx}"],
//   theme: {
//     extend: {
//       backgroundImage: {
//         "home-bkg": "url('/src/assets')",
//       },
//     },
//   },
//   plugins: [require("@tailwindcss/forms")],
// } satisfies Config;

import type { Config } from "tailwindcss";
import formsPlugin from "@tailwindcss/forms";

export default {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "home-bkg": "url('/src/assets')",
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
