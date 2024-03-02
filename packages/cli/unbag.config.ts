import { TsToJsPlugin, defineConfig, TsToDtsPlugin } from "@vico/unbag";
import { getCommonPackagesUnbagConfig } from "../../scripts/unbag-config";
const commonConfig = getCommonPackagesUnbagConfig();
export default defineConfig({
  ...commonConfig,
  entry: "./src",
  sourcemap: true,
  plugins: [
    {
      plugin: TsToDtsPlugin(),
      config: {
        output: "./dist/types",
      },
    },
    {
      plugin: TsToJsPlugin({
        format: "esm",
      }),
      config: {
        output: "./dist/esm",
      },
    },
    {
      plugin: TsToJsPlugin({
        format: "cjs",
      }),
      config: {
        output: "./dist/cjs",
      },
    },
  ],
});
