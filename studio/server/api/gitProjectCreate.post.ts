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

const token = "glpat-hiPdupZ2DVBUYJwmob71";
const rootToken = "glpat-psSsnqupXyAeebvws5yp";

export default defineEventHandler(async (event) => {
  const body = await useSafeValidatedBody(
    event,
    zod.object({
      name: zod.string(),
      path: zod.string(),
    })
  );
  console.log("/api/gitProjectCreate");

  if (!body.success) {
    console.log(body.error.message);
    throw createError({
      statusCode: 400,
      statusMessage: body.error.message,
    });
  }
  console.log("success");
  const api = new Gitlab({
    host: "http://localhost:80",
    token,
  });
  const project = await api.Projects.create({
    name: body.data.name,
    path: body.data.path,
  });
  console.log("project",project)

  const vfs = createVfs();
  const fs = vfs.getFs();
  // const fs = new FS("test");
  const dir = "/temp";
  const ref = "main";
  await git.clone({
    fs,
    http,
    dir,
    url: "http://localhost:80/root/template.git",
    ref,
    singleBranch: true,
    onAuth: () => {
      return {
        password: token,
      };
    },
  });
  console.log("listFiles");
  // let files = await vfs.listFiles("/fddd");
  let files = await git.listFiles({ fs, dir, ref });
  const filesMap = await Promise.all(
    files.map(async (f) => {
      return await vfs.readFile(path.default.join(dir, f), "utf-8");
    })
  );
  console.log("filesMap", filesMap);
  // const sss = await git.add({fs,})
  console.log("files", files);
  await vfs.outputFile(`${dir}/sssss.txt`, "ddasssssda");
  let filess = await git.listFiles({ fs, dir, ref });
  console.log("filess", files);
  await git.add({ fs, dir, filepath: "." });
  await git.commit({
    fs,
    dir,
    author: {
      name: "root",
      email: "mrtest@example.com",
    },
    message: "Added the a.txt file",
  });
  await git.push({
    fs,
    http,
    dir,
    url: "http://localhost:80/root/template.git",
    ref,
    onAuth: () => {
      return {
        password: rootToken,
      };
    },
  });

  // await api.Commits.create(aa.id, "main", "init by vico", [
  //   {
  //     action: "create",
  //     filePath: "/text.txt",
  //     content: "fsdfhdskhfjk",
  //   },
  // ]);

  console.log("success create");
  // return project;
  // const projectItem = await ProjectModel.findById(query.data.id);
  // return projectItem;
});
