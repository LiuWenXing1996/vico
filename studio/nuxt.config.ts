import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@sidebase/nuxt-auth", "nuxt-icons"],

  pages: true,
  alias: {
    cookie: "cookie",
  },
  routeRules: {
    "/studio/**": { ssr: false },
    "/auth/**": { ssr: false },
    "/admin/**": { ssr: false },
  },
  devtools: { enabled: true },
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: "authjs",
    },
  },
  vite: {
    plugins: [
      // @ts-ignore
      nodePolyfills(),
    ],
  },
});
