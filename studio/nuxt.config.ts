import { nodePolyfills } from "vite-plugin-node-polyfills";
import { cpSync } from "node:fs";
import path from "node:path";
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
  nitro: {
    serverAssets: [
      {
        baseName: "my_directory",
        dir: "./server/my_directory",
      },
    ],
    storage: {
      data: {
        driver: "fs",
        base: "./data",
      },
    },
  },
  runtimeConfig: {
    oauth: {
      github: {
        clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
        clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      },
    },
  },
  hooks: {
    "nitro:build:public-assets": (nitro) => {
      console.log("nitro:build:public-assets");
      const targetDir = path.join(nitro.options.output.serverDir, "data");
      cpSync("./server/data", targetDir, { recursive: true });
    },
  },
});
