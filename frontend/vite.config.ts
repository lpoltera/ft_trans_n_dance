// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,//When not running with docker compose, this is the port which will be used in docker
    hmr: {
      overlay: false
    },
  }
})

// vite.config.js
// import { defineConfig } from 'vite';

// export default defineConfig({
//   server: {
//     host: 'localhost',
//     port: 3000,
//     hmr: {
//       protocol: 'ws', // Active le mode WebSocket
//     },
//   },
// });
