import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import rehypeBeautifulMermaid from './src/lib/rehype-beautiful-mermaid.ts';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://iamsamiul.me',
  output: 'static',
  compressHTML: true,
  markdown: {
    syntaxHighlight: {
      type: 'shiki',
      excludeLangs: ['mermaid'],
    },
    processor: unified({
      rehypePlugins: [rehypeBeautifulMermaid],
    }),
  },
  vite: {
    ssr: { noExternal: ['three', 'lenis', 'gsap', 'beautiful-mermaid'] },
    plugins: [tailwindcss()],
    // Three.js hero chunk is ~490KB (eager; deferred load left a blank canvas).
    build: {
      chunkSizeWarningLimit: 700,
    },
  },
});
