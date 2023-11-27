import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { config } from "./config";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Get rid of the CORS error
    proxy: {
      "/api": {
        target: config.APIURI,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
