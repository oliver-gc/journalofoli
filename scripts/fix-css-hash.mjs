/**
 * Post-build script that fixes CSS hash mismatches between client and SSR builds.
 *
 * Tailwind CSS v4's Vite plugin processes CSS independently in the client and
 * SSR build passes. On different platforms (e.g. Alpine Linux in Docker vs
 * Windows), the file scan order can differ, producing different CSS content
 * and therefore different content hashes. The client build writes the real
 * CSS file to .output/public/assets/, but the SSR server bundle may reference
 * a different hash that doesn't exist on disk.
 *
 * This script reads the actual CSS filename from the client build output and
 * patches the server bundle to reference it.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const assetsDir = join(root, ".output", "public", "assets");
const serverDir = join(root, ".output", "server");

// 1. Find the real CSS file produced by the client build
const cssFiles = readdirSync(assetsDir).filter(
  (f) => f.startsWith("styles-") && f.endsWith(".css"),
);

if (cssFiles.length !== 1) {
  console.error(
    `[fix-css-hash] Expected 1 styles-*.css file, found ${cssFiles.length}:`,
    cssFiles,
  );
  process.exit(1);
}

const correctUrl = `/assets/${cssFiles[0]}`;

// 2. Walk .output/server/ for .mjs files (skip node_modules)
function collectMjs(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      results.push(...collectMjs(full));
    } else if (entry.name.endsWith(".mjs")) {
      results.push(full);
    }
  }
  return results;
}

// 3. Replace any wrong /assets/styles-*.css reference with the correct one
const pattern = /\/assets\/styles-[a-zA-Z0-9_-]+\.css/g;
let fixed = 0;

for (const file of collectMjs(serverDir)) {
  const src = readFileSync(file, "utf-8");
  if (pattern.test(src)) {
    // Reset lastIndex since we used .test()
    pattern.lastIndex = 0;
    writeFileSync(file, src.replace(pattern, correctUrl));
    fixed++;
  }
}

console.log(
  `[fix-css-hash] Patched ${fixed} server file(s) → ${correctUrl}`,
);
