import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: `https://realtour-backend.onrender.com`,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
