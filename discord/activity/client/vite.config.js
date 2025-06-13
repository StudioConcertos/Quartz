import { defineConfig } from "vite";

export default defineConfig({
  envDir: "../",
  server: {
    host: true,
    allowedHosts: ["*.trycloudflare.com"],
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
  },
});
