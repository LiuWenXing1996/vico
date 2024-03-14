import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [ "nuxt-icons"],
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
  // auth: {
  //   globalAppMiddleware: true,
  //   provider: {
  //     type: "authjs",
  //   },
  // },
  // runtimeConfig: {
  //   authJs: {
  //     secret: process.env.NUXT_NEXTAUTH_SECRET, // You can generate one with `openssl rand -base64 32`
  //   },
  //   public: {
  //     authJs: {
  //       baseUrl: process.env.NUXT_NEXTAUTH_URL, // The URL of your deployed app (used for origin Check in production)
  //       verifyClientOnEveryRequest: true, // whether to hit the /auth/session endpoint on every client request
  //     },
  //   },
  // },
  vite: {
    plugins: [nodePolyfills()],
  },
});
