import type { ProjectManifest } from "@pnpm/types";
import type { DeepRequired } from "utility-types";
import { createFsUtils, type IFsPromisesApi } from "./fs";
import type { IViewSchema } from "../schemas/view";
import path from "./path";

export interface IBuildConfig {
  root?: string;
  ignorePaths?: string[];
  outdir?: string;
  minify?: boolean;
  tempDir?: string;
  sourcemap?: boolean;
  viewEntryFile: string;
  viewSchemaFileSuffix: string;
  viewFileSuffix: {
    component: string;
    page: string;
    layout: string;
  };
  embed?: {
    name: string;
    externals?: {
      packageName: string;
      injectName: string;
    }[];
  }[];
  deps?: {
    name: string;
    entry?: string;
    injectName?: string; // 是不是必须的？
  }[];
  overrideCookMetas: {
    name: string;
    meta: ICookMeta;
  }[];
}

export interface ICookMeta {
  isRemotePlugin?: boolean;
  remotePluginVarName?: string;
  remotePlugins?: {
    name: string;
    varName: string;
  }[];
  materialsVarName?: string;
  viewsVarName?: string;
  editorsVarName?: string;
  materials?: { name: string; varName: string }[];
  runtimeEntry?: {
    import?: string;
    assets?: string[];
  };
  designerEntry?: {
    import?: string;
    assets?: string[];
  };
}

export interface ICookMaterialConfig {
  editorEntry: {
    js: string;
    css: string;
  };
  designViewEntry: {
    js: string;
    css: string;
  };
}

export type IDeepRequiredBuildConfig = DeepRequired<IBuildConfig>;
export type IPkgJson = ProjectManifest & {
  buildConfigFile?: string; // support json and yaml ? or only yaml
  buildMetaFile?: string; // support json and yaml ? or only yaml
};

export const getBuildConfigRelativePath = (pkgJson: IPkgJson) => {
  return pkgJson.buildConfigFile || "build.config.json";
};

export const getPkgJsonFromFs = async (fs: IFsPromisesApi) => {
  try {
    const fsUtils = createFsUtils(fs);
    const packageJsonPath = "/package.json";
    const pkgJson = await fsUtils.readJson<IPkgJson>(packageJsonPath);
    return {
      path: packageJsonPath,
      content: pkgJson,
    };
  } catch (error) {}
};

export const getBuildConfigFromFs = async (fs: IFsPromisesApi) => {
  try {
    const fsUtils = createFsUtils(fs);
    const { content: pkgJson, path: packageJsonPath } =
      (await getPkgJsonFromFs(fs)) || {};
    if (pkgJson && packageJsonPath) {
      let buildConfigPath = "/build.config.json";
      if (pkgJson.buildConfigFile) {
        buildConfigPath = path.resolve(
          path.dirname(packageJsonPath),
          pkgJson.buildConfigFile
        );
      }
      const buildConfig = await fsUtils.readJson<IBuildConfig>(buildConfigPath);
      return {
        path: buildConfigPath,
        content: fillConfig(buildConfig),
      };
    }
  } catch (error) {}
};

export const getViewFilesFromFs = async (fs: IFsPromisesApi) => {
  const viewFilesWithContent: {
    path: string;
    content: IViewSchema;
  }[] = [];

  const { content: buildConfig } = (await getBuildConfigFromFs(fs)) || {};
  if (buildConfig) {
    const fsUtils = createFsUtils(fs);
    const allFiles = await fsUtils.listFiles();
    const viewFilePaths: string[] = allFiles.filter((e) => {
      return e.endsWith(buildConfig.viewSchemaFileSuffix);
    });
    await Promise.all(
      viewFilePaths.map(async (filePath) => {
        try {
          const schema = await fsUtils.readJson<IViewSchema>(filePath);
          viewFilesWithContent.push({
            path: filePath,
            content: schema,
          });
        } catch (error) {
          console.log(error);
        }
      })
    );
  }

  return viewFilesWithContent;
};

export const getViewSchemaFilePathListFromFs = async (fs: IFsPromisesApi) => {
  let filePathList: string[] = [];

  const { content: buildConfig } = (await getBuildConfigFromFs(fs)) || {};
  if (buildConfig) {
    const fsUtils = createFsUtils(fs);
    const allFiles = await fsUtils.listFiles();
    const viewFilePaths: string[] = allFiles.filter((e) => {
      return e.endsWith(buildConfig.viewSchemaFileSuffix);
    });
    filePathList = [...viewFilePaths];
  }
  return filePathList;
};

export const fillConfig = (config: IBuildConfig): IDeepRequiredBuildConfig => {
  const defaultConfig = getBuildConfigDefault();

  let _config = {
    ...defaultConfig,
    ...config,
  } as IDeepRequiredBuildConfig;

  return _config;
};

export const getBuildConfigDefault = () => {
  const defaultConfig: IDeepRequiredBuildConfig = {
    root: "./src",
    ignorePaths: [],
    outdir: "./dist",
    minify: true,
    tempDir: "./node_modules/.vue-build",
    sourcemap: true,
    deps: [],
    overrideCookMetas: [],
    viewEntryFile: "view.json",
    viewFileSuffix: {
      component: ".component.html",
      page: ".page.html",
      layout: ".layout.html",
    },
    viewSchemaFileSuffix: "",
    embed: [],
  };
  return defaultConfig;
};
