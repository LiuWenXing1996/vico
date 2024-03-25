import type { H3Event } from "h3";
import { Octokit } from "@octokit/core";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import { createFsUtils, createVfs, path } from "@vico/core";
import JSZip from "jszip";

export const getGithubOauthConfig = () => {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const stateSessionPassword = process.env.GITHUB_OAUTH_STATE_SESSION_PASSWORD;
  if (!clientId) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITHUB_OAUTH_CLIENT_ID",
    });
  }
  if (!clientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITHUB_OAUTH_CLIENT_SECRET",
    });
  }
  if (!stateSessionPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITHUB_OAUTH_STATE_SESSION_PASSWORD",
    });
  }

  return { clientId, clientSecret, stateSessionPassword };
};

export const createRepo = async (params: {
  token: string;
  name: string;
  description?: string;
}) => {
  const { token, name, description } = params;
  const octokit = new Octokit({ auth: token });
  return await octokit.request("POST /user/repos", {
    name,
    description,
  });
};

export const updateRepo = async (params: {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  message: string;
  zipFileBuffer: Buffer;
}) => {
  const { zipFileBuffer, token, owner, repo, branch } = params;
  const octokit = new Octokit({ auth: token });
  const res = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
  });
  const url = res.data.html_url;
  const vfs = createVfs();
  const fs = vfs.getFs();
  const baseDir = "/base";
  await git.clone({
    fs,
    http,
    dir: baseDir,
    url: url,
    ref: branch,
    singleBranch: true,
    onAuth: () => {
      return {
        password: token,
      };
    },
  });
  const allFiles = await git.listFiles({ fs, dir: baseDir, ref: branch });
  await Promise.all(
    allFiles.map(async (filePath) => {
      await vfs.remove(path.default.join(baseDir, filePath));
    })
  );
  const zipFile = await JSZip.loadAsync(zipFileBuffer, {
    createFolders: false,
  });
  await Promise.all(
    Object.keys(zipFile.files).map(async (file) => {
      const zipd = zipFile.files[file];
      if (!zipd.dir) {
        const content = await zipd.async("base64");
        const filePathSepList = file.split("/");
        const [root, ...restFilePathSepList] = filePathSepList;
        const newFilePath = restFilePathSepList.join("/");
        await vfs.outputFile(path.default.join(baseDir, newFilePath), content);
      }
    })
  );
  await git.remove({ fs, dir: baseDir, filepath: "." });
  await git.commit({
    fs,
    dir: baseDir,
    author: {
      name: "root",
      email: "mrtest@example.com",
    },
    message: `updateRepo`,
  });
};

export const getRepoZipFile = async (params: type) => {};
