import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
    "nuxt-auth-utils",
    "nuxt-icons",
    "nuxt-radash",
    "@vueuse/nuxt",
  ],
  pages: true,
  routeRules: {
    "/": { redirect: "/studio" },
    "/studio/**": { ssr: false },
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
