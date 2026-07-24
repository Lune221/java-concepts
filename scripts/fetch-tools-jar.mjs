/**
 * Downloads tools.jar into public/ so the playground can find it.
 *
 * javac itself lives in tools.jar (com.sun.tools.javac.Main). CheerpJ mounts
 * the site's own web root at /app/, so serving this file from public/ makes
 * it reachable at /app/tools.jar — see JAVAC_CLASSPATH in src/lib/cheerpj.ts.
 * Sourced from the JavaFiddle reference implementation
 * (github.com/leaningtech/javafiddle, Apache-2.0).
 *   node scripts/fetch-tools-jar.mjs
 */
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";

const URL = "https://raw.githubusercontent.com/leaningtech/javafiddle/main/static/tools.jar";
const DEST = "public/tools.jar";

if (existsSync(DEST)) {
  console.log("tools.jar already present, skipping download.");
  process.exit(0);
}

console.log(`Fetching tools.jar from ${URL} ...`);
const res = await fetch(URL);
if (!res.ok) {
  console.error(`Download failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}

await mkdir("public", { recursive: true });
await writeFile(DEST, Buffer.from(await res.arrayBuffer()));
console.log(`Saved ${DEST}`);
