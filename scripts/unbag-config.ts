import { TsToJsPlugin, defineConfig, TsToDtsPlugin } from "@vico/unbag";

export const getCommonPackagesUnbagConfig = () =>
  defineConfig({
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
