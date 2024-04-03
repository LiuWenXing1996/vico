import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nuxt-auth-utils", "nuxt-icons"],
  pages: true,
  routeRules: {
    "/studio/**": { ssr: false },
    "/auth/**": { ssr: false },
    "/admin/**": { ssr: false },
  },
  devtools: { enabled: true },
  vite: {
    plugins: [
      // @ts-ignore
      nodePolyfills(),
    ],
  },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      },
    },
  },
});
