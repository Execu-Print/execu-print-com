import { defineConfig } from 'astro/config';
import lit from "@astrojs/lit";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: 'https://execu-print.husanu.com',
  integrations: [lit(), mdx(), sitemap()],
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    cors: {
      origin: false
    }
  }
});
