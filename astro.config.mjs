import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  // Fully static output: Cloudflare Pages serves dist/ as plain files.
  output: "static",
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  markdown: { shikiConfig: { theme: "github-light", wrap: true } },
});
