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

  // Authorize remote image domains for build-time optimization (exhibitions + other content).
  image: {
    domains: [
      "www.leventhalmap.org",
      "leventhalmap.org",
      "iiif.digitalcommonwealth.org",
      "bostonathenaeum.org",
      "ml1bu7iavnet.i.optimole.com",
      "declaration.fas.harvard.edu",
    ],
  },
});