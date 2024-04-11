// import { Octokit } from "@octokit/core";
import { Octokit } from "octokit";
import { createVfs, path } from "@vico/core";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import JSZip from "jszip";
import type { H3Event } from "h3";
import { giteaApi, type Api } from "gitea-js";

export class GiteaClient {
  #api: Api<unknown>;
  #token: string;
  get api() {
    return this.#api;
  }
  get token() {
    return this.#token;
  }
  constructor(params: { token: string }) {
    const { token } = params;
    this.#token = token;
    const baseUrl = process.env.GITEA_BASE_URL;
    if (!baseUrl) {
      throw createError({
        statusCode: 500,
        statusMessage: "undefined GITEA_BASE_URL",
      });
    }
    this.#token = token;
    this.#api = giteaApi(baseUrl, { token });
  }
  async createUser(params: {
    email: string;
    password: string;
    username: string;
  }) {
    const res = await this.api.admin.adminCreateUser({
      email: params.email,
      password: params.password,
      username: params.username,
    });
    return res.data;
  }
  async crearteAccessToken(params: {
    username: string;
    name: string;
    scopes: string[];
  }) {
    const res = await this.api.users.userCreateToken(params.username, {
      name: params.name,
      scopes: params.scopes,
    });
    return res.data;
  }
  async branchList(params: {
    owner: string;
    repo: string;
    page: number;
    limit: number;
  }) {
    const { limit, page, owner, repo } = params;
    const res = await this.api.repos.repoListBranches(owner, repo, {
      page,
      limit,
    });
    const total = Number(res.headers.get("x-total-count")) || 0;
    return {
      data: res.data,
      total,
    };
  }

  async repoCreateFormTemplate(params: {
    templateOwner: string;
    templateRepo: string;
    templateBranch: string;
    name: string;
    description?: string;
  }) {
    const { name, description, templateBranch, templateOwner, templateRepo } =
      params;
    const templateRepoZipFile = await this.getRepoZipFile({
      owner: templateOwner,
      repo: templateRepo,
      branch: templateBranch,
    });
    const repo = await this.createRepo({ name, description });
    const updateRes = await this.updateRepo({
      owner: repo.owner.login,
      repo: repo.name,
      branch: "main",
      message: "init by template",
      zipFile: templateRepoZipFile,
    });
    return updateRes;
  }

  async getCurrnetUser() {
    const res = await this.api.user.userGetCurrent();
    const user = res.data;
    if (!user) {
      throw createError({
        statusCode: 400,
        statusMessage: "没有找到gitea user",
      });
    }
    return user;
  }
  async listCurrentUserRepo(params: {
    page: number;
    limit: number;
    key?: string;
  }) {
    const currentUser = await this.getCurrnetUser();
    const { page, limit, key } = params;
    const res = await this.api.repos.repoSearch({
      q: key,
      limit: limit,
      page: page,
      uid: currentUser.id,
    });
    const total = Number(res.headers.get("x-total-count")) || 0;
    return {
      data: res.data.data,
      total,
    };
  }
  async createRepo(params: {
    name: string;
    description?: string;
    templateOwner: string;
    templateRepo: string;
  }) {
    const user = await this.getCurrnetUser();
    // TODO:还是使用自定义的repo from tpl更好一点？
    const res = await this.api.repos.generateRepo(
      params.templateOwner,
      params.templateRepo,
      {
        default_branch: "main",
        description: params.description,
        name: params.name,
        owner: user.login_name || "",
      }
    );
    return res.data;
  }
  async getRepo(params: { owner: string; repo: string }) {
    const repoRes = await this.api.repos.repoGet(params.owner, params.repo);
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
      url: url || "",
      ref: branch,
      singleBranch: true,
      onMessage: console.log,
      onAuth: () => {
        return {
          username: "token",
          password: this.token,
        };
      },
      onAuthFailure: (s, ss) => {
        debugger;
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
    // TODO:没有分支的时候需要创建分支。。。
    await git.clone({
      fs,
      http,
      dir: baseDir,
      url: url || "",
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
  async searchRepo(params: { page: number; limit: number; key?: string }) {
    const { limit, key, page } = params;
    const q = `${key ? ` ${key} in:name` : ""}`;
    const listRes = await this.api.request("GET /search/repositories", {
      page,
      q,
      per_page: limit,
    });
    return listRes;
  }
}

export const useGiteaClient = async (event: H3Event) => {
  const githubTokenSession = await requireGithubTokenSession(event);
  const githubClient = new GiteaClient({ token: githubTokenSession.content });
  return githubClient;
};
