import { Octokit } from "@octokit/core";
import { createVfs, path } from "@vico/core";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import JSZip from "jszip";
import type { H3Event } from "h3";

export class GithubClient {
  #octokit: Octokit;
  #token: string;
  get octokit() {
    return this.#octokit;
  }
  get token() {
    return this.#token;
  }
  constructor(params: { token: string }) {
    const { token } = params;
    this.#token = token;
    this.#octokit = new Octokit({ auth: token });
  }
  async createRepo(params: { name: string; description?: string }) {
    const { name, description } = params;
    const repoRes = await this.octokit.request("POST /user/repos", {
      name,
      description,
    });
    return repoRes.data;
  }
  async getRepo(params: { owner: string; repo: string }) {
    const { owner, repo } = params;
    const repoRes = await this.octokit.request("GET /repos/{owner}/{repo}", {
      owner,
      repo,
    });
    return repoRes.data;
  }
  async getRepoZipFile(params: {
    owner: string;
    repo: string;
    branch: string;
  }) {
    const { owner, repo, branch } = params;
    const repoDetail = await this.getRepo({ owner, repo });
    const { html_url: url } = repoDetail;
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
          password: this.token,
        };
      },
    });
    const allFiles = await git.listFiles({ fs, dir: baseDir, ref: branch });
    const zip = new JSZip();
    await Promise.all(
      allFiles.map(async (filePath) => {
        const content = await vfs.readFile(
          path.default.join(baseDir, filePath)
        );
        zip.file(filePath, content);
      })
    );
    const blobRes = await zip.generateAsync({
      type: "blob",
    });
    return blobRes;
  }
  async updateRepo(params: {
    owner: string;
    repo: string;
    branch: string;
    message: string;
    zipFile: Blob;
  }) {
    const { owner, repo, branch, zipFile, message } = params;
    const repoDetail = await this.getRepo({ owner, repo });
    const { html_url: url } = repoDetail;
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
          password: this.token,
        };
      },
    });
    const allFiles = await git.listFiles({ fs, dir: baseDir, ref: branch });
    await Promise.all(
      allFiles.map(async (filePath) => {
        await vfs.remove(path.default.join(baseDir, filePath));
      })
    );
    const zip = await JSZip.loadAsync(zipFile, {
      createFolders: false,
    });
    await Promise.all(
      Object.keys(zip.files).map(async (file) => {
        const zipd = zip.files[file];
        if (!zipd.dir) {
          const content = await zipd.async("base64");
          const filePathSepList = file.split("/");
          const [root, ...restFilePathSepList] = filePathSepList;
          const newFilePath = restFilePathSepList.join("/");
          await vfs.outputFile(
            path.default.join(baseDir, newFilePath),
            content
          );
        }
      })
    );
    await git.remove({ fs, dir: baseDir, filepath: "." });
    await git.commit({
      fs,
      dir: baseDir,
      message: message,
    });
    return await this.getRepo({ owner, repo });
  }
  async repoList(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const listRes = await this.octokit.request("GET /user/repos", {
      page,
      per_page: limit,
    });
    console.log("listRes.headers.link", listRes.headers.link);
    return listRes.data;
  }
}

export const useGithubClient = async (event: H3Event) => {
  const userId = event.context.user?.id;
  const prismaClient = usePrismaClient();
  const userSecretConfig = await prismaClient.userSecretConfig.findUnique({
    where: {
      id: userId,
    },
  });
  if (!userSecretConfig?.githubToken) {
    throw createError({
      statusCode: 500,
      statusMessage: "unknown githubToken",
    });
  }
  return new GithubClient({ token: userSecretConfig.githubToken });
};
