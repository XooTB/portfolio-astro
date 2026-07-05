import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: 'static',
  compressHTML: true,
  integrations: [react()],
  vite: {
    ssr: { noExternal: ['three', 'lenis'] },
    plugins: [tailwindcss()],
  },
});
