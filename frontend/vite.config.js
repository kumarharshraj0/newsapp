import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Custom plugin to make CSS non-render-blocking (drops FCP significantly)
function deferCssPlugin() {
  return {
    name: 'defer-css',
    transformIndexHtml(html) {
      // Find all stylesheet links injected by Vite and make them async
      return html.replace(
        /<link\s+rel="stylesheet"\s+crossorigin\s+href="([^"]+)">/g,
        '<link rel="preload" as="style" crossorigin href="$1" />\n    <link rel="stylesheet" crossorigin href="$1" media="print" onload="this.media=\'all\'" />'
      )
    }
  }
}

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        secure: false,
      },
    },
  },
  preview: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        secure: false,
      },
    },
  },
  plugins: [react(), deferCssPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Manual vendor chunking — splits big libraries into separate cacheable chunks
    // React, router, and redux rarely change → cached long-term by browser
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "vendor-ui": ["lucide-react", "react-icons"],
        },
      },
    },
    // Target modern browsers for smaller output
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  // Remove console.log and debugger in production builds
  esbuild: mode === "production"
    ? { drop: ["console", "debugger"] }
    : {},
}))
