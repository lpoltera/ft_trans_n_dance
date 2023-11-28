import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true, // Port strict pour la correspondance exacte
    hmr: {
      host: "localhost",
      port: 3000, // Le même port que server.port
      clientPort: 3000, // Correspond au port utilisé par le navigateur pour HMR
      protocol: "ws",
      overlay: false,
    },
  },
});
