import { defineConfig } from "nitro";

export default defineConfig({
  preset: "node-server",

  serveStatic: true,
  compressPublicAssets: {
    gzip: true,
    brotli: true,
  },

  routeRules: {
    "/assets/**": {
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
        "cdn-cache-control": "public, max-age=31536000, immutable",
      },
    },
    "/": {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
        "cdn-cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
    "/posts/**": {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
        "cdn-cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
    "/projects": {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
        "cdn-cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
    "/contact": {
      headers: {
        "cache-control": "public, max-age=60, stale-while-revalidate=300",
        "cdn-cache-control": "public, max-age=60, stale-while-revalidate=300",
      },
    },
    "/api/**": {
      headers: {
        "cache-control": "no-store",
        "cdn-cache-control": "no-store",
      },
    },
    "/_auth/**": {
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