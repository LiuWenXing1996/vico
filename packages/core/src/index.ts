import * as path from './utils/path'

export type IPath = typeof path
export { path }
export {
  createFsUtils,
  type IFsPromisesApi,
  type IFsUtils,
  createVfs,
  type IVirtulFileSystem
} from './utils/fs'
export {
  type ICookConfig,
  fillConfig,
  getCookConfigRelativePath,
  getCookConfigFromFs,
  getPkgJsonFromFs,
  getViewFilesFromFs,
  getViewSchemaFilePathListFromFs,
  type IPkgJson,
  type IDeepRequiredCookConfig,
  type ICookMaterialConfig,
  type ICookMeta
} from './utils/cookConfig'

export { type IAttributeSchema } from './schemas/attribute'
export { type ITemplateSchema } from './schemas/template'

export {
  type IViewSchema,
  type IViewSchemaFile,
  type IPageViewSchema,
  type IComponentViewSchema,
  type ILayoutViewSchema,
  viewSchemaParser,
  viewSchemaToCode
} from './schemas/view'
export { type IContext, Context, defineContext, contextSchemaToCode } from './schemas/context'
export {
  type ITemplateTreeTemplateNode as ITemplateTreeSchemaNode,
  templateSchemaParser,
  templateSchemaToTsxTemplate
} from './schemas/template'
export { exportSchemaToCode } from './schemas/export'

export { cjsWrapperLoadWrapperJs, CjsWrapperBanner, CjsWrapperFooter } from './utils/cjs-wrapper'

export { autoLoadSchema, loadSchema } from './utils/schema-loader'