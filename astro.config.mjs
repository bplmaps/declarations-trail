// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [svelte()],

  // Authorize remote image domains for build-time optimization.
  // Add hostnames here for any external image URLs used in exhibitions (e.g. "example.com").
  image: {
    domains: ["www.leventhalmap.org", "leventhalmap.org", "iiif.digitalcommonwealth.org"],
  },
});