import { Gitlab } from "@gitbeaker/rest";
import {
  useSafeValidatedBody,
  useSafeValidatedQuery,
  useValidatedBody,
} from "h3-zod";
import { ProjectModel } from "../models/project";
import zod from "zod";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import FS from "@isomorphic-git/lightning-fs";
import { createFsUtils, createVfs, path } from "@vico/core";

const token = "glpat-Cy6s3vafdZaZ5Aj5vzkD";
const rootToken = "glpat-Cy6s3vafdZaZ5Aj5vzkD";

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(
    event,
    zod.object({
      fromUrl: zod.string(),
      fromBranch: zod.string(),
      toUrl: zod.string(),
      toBranch: zod.string(),
    })
  );
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    });
  }
  const { fromUrl, fromBranch, toUrl, toBranch } = body.data;
  const vfs = createVfs();
  const fs = vfs.getFs();
  const fromDir = "/from";
  const toDir = "/to";
  await git.clone({
    fs,
    http,
    dir: fromDir,
    url: fromUrl,
    ref: fromBranch,
    singleBranch: true,
    onAuth: () => {
      return {
        password: token,
      };
    },
  });
  await git.clone({
    fs,
    http,
    dir: toDir,
    url: toUrl,
    ref: toBranch,
    singleBranch: true,
    onAuth: () => {
      return {
        password: token,
      };
    },
  });
  const fromFiles = await git.listFiles({ fs, dir: fromDir, ref: fromBranch });
  await Promise.all(
    fromFiles.map(async (filePath) => {
      const content = await vfs.readFile(path.default.join(fromDir, filePath));
      await vfs.outputFile(path.default.join(toDir, filePath), content);
    })
  );
  await git.add({ fs, dir: toDir, filepath: "." });
  await git.commit({
    fs,
    dir: toDir,
    author: {
      name: "root",
      email: "mrtest@example.com",
    },
    message: `merged from ${fromUrl} ${fromBranch}`,
  });
  return true;
});
