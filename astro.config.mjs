// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: 'server',
  vite: {    plugins: [tailwindcss()],  },
  site: 'https://coderhn.netlify.app',
});