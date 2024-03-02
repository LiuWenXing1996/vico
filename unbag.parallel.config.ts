import { defineParallelConfig } from "@vico/unbag";
import waitOn from "wait-on";

export default defineParallelConfig({
  commands: [
    {
      name: "core",
      npmScript: "pnpm --filter '@vico/core' dev",
    },
    {
      name: "studio",
      wait: async () => {
        let res = false;
        try {
          await waitOn({
            resources: ["./packages/core/dist/esm/index.js"],
          });
          res = true;
        } catch (err) {
          res = false;
        }
        return res;
      },
      npmScript: "pnpm --filter 'studio' dev",
    },
  ],
});
