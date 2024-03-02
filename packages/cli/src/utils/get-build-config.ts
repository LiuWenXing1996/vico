import {
  type IDeepRequiredCookConfig,
  CjsWrapperBanner,
  CjsWrapperFooter,
  ElementDataCoreLibOnceGetterIdIdKey,
  ElementDataLowcodeContextIdKey
} from '@vue-cook/core'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import type { InlineConfig } from 'vite'

export const getBuildConfig = (params: {
  cookConfig: IDeepRequiredCookConfig
  externals: IDeepRequiredCookConfig['embed'][0]['externals']
  outDir: string
  entry: string
}) => {
  let { externals, cookConfig, outDir, entry } = params
  // externals = externals
  //   .filter((e) => e.packageName !== '@vue-cook/core')
  //   .concat({
  //     packageName: '@vue-cook/core',
  //     injectName: 'VueCookCore'
  //   })
  const buildConfig: InlineConfig = {
    publicDir: false,
    // FIX:有commonJs会造成cjsWrapperLoader加载失败
    // plugins: [nodeResolve(), commonjs(), nodePolyfills()],
    plugins: [nodeResolve(), nodePolyfills()],
    build: {
      minify: cookConfig.minify,
      outDir: outDir,
      sourcemap: cookConfig.sourcemap,
      target:"esnext",
      lib: {
        entry,
        name: 'deps',
        formats: ['cjs'],
        fileName: () => {
          return 'index.js'
        }
      },
      rollupOptions: {
        external: (id: string) => {
          return externals
            .map((e) => e.packageName)
            .some((pkg) => id === pkg || id.startsWith(`${pkg}/`))
        },
        output: {
          banner: CjsWrapperBanner,
          footer: CjsWrapperFooter,
          globals: (id) => {
            const pkg = externals.find((e) => {
              return id === e.packageName || id.startsWith(`${e.packageName}/`)
            })
            return pkg?.injectName || ''
          }
        }
      }
    }
  }

  return buildConfig
}
