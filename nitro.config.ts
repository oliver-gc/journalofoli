import { defineConfig } from "nitro";

export default defineConfig({
  preset: "node-server",

  serveStatic: true,

  routeRules: {
    "/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "cdn-cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/api/**": {
      headers: {
        "cache-control": "no-store",
        "cdn-cache-control": "no-store",
      },
    },
    "/**": {
      headers: {
        "cache-control": "no-store",
        "cdn-cache-control": "no-store",
      },
    },
  },
});