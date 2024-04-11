import {
  addImports,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  updateTemplates,
} from "nuxt/kit";
import type { Nitro } from "nitropack";
import { debounce } from "perfect-debounce";

export interface ServerRouteInfo {
  route: string;
  filepath: string;
  method?: string;
  type: "api" | "route" | "runtime" | "collection";
  routes?: ServerRouteInfo[];
}

export default defineNuxtModule((options, nuxt) => {
  // let nitro: Nitro | undefined = undefined;
  // let cache: ServerRouteInfo[] | null = null;
  // const resolver = createResolver(import.meta.url);
  // const filename = "types/typed-fecth.d.ts";

  // addTypeTemplate({
  //   filename,
  //   getContents: () => `// Generated by typed-fecth
  //     declare module '#typed-fecth' {
  //         import type { Serialize, Simplify } from 'nitropack'
  //         export interface IApiMap {
  //           ${cache
  //             ?.map((e) => {
  //               return `"${e.route}":{
  //                   method: "${e.method}";
  //                   requestData: import("${e.filepath}").Params;
  //                   responseData: Serialize<import("${e.filepath}").Return>;
  //               }`;
  //             })
  //             .join(";\n")}
  //       }
  //     }`,
  // });

  // addImports([
  //   {
  //     name: "useTypedFetch",
  //     as: "useTypedFetch",
  //     from: resolver.resolve("runtime/composables/use-typed-fetch"),
  //   },
  //   {
  //     name: "$typedFetch",
  //     as: "$typedFetch",
  //     from: resolver.resolve("runtime/utils/$typed-fetch"),
  //   },
  // ]);

  // function scan() {
  //   // if (cache) return cache;

  //   cache = (() => {
  //     if (!nitro) return [];
  //     return [
  //       ...nitro.scannedHandlers
  //         .filter((item) => !item.middleware)
  //         .map((item) => ({
  //           route: item.route,
  //           filepath: item.handler,
  //           method: item.method,
  //           type: item.route?.startsWith("/api") ? "api" : "route",
  //         })),
  //       ...nitro.options.handlers
  //         .filter(
  //           (item) =>
  //             !item.route?.startsWith("/_nitro") &&
  //             !item.route?.startsWith("/__nuxt") &&
  //             !item.middleware
  //         )
  //         .map((item) => ({
  //           route: item.route,
  //           filepath: item.handler,
  //           method: item.method,
  //           type: "runtime",
  //         })),
  //     ] as any[];
  //   })();

  //   updateTemplates({ filter: (t) => t.filename === filename });
  //   console.log("scan");

  //   return cache;
  // }
  // const refreshDebounced = debounce(() => {
  //   cache = null;
  //   scan();
  // }, 500);
  // nuxt.hook("nitro:init", (_nitro) => {
  //   nitro = _nitro;
  //   nitro?.storage.watch((event, key) => {
  //     refreshDebounced();
  //   });
  // });
});
