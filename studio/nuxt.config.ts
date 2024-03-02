import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-icons'],
  pages: true,
  routeRules: {
    "/studio/**": { ssr: false },
  },
  devtools: { enabled: true },
  vite: {
    plugins: [nodePolyfills()],
  },
  nitro: {
    plugins: [
      '@/server/db'
    ]
  }
});
