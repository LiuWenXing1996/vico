// import { Octokit } from "@octokit/core";
import { Octokit } from "octokit";
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
  async branchList(params: {
    owner: string;
    repo: string;
    page: number;
    limit: number;
    key?: string;
  }) {
    const { limit, key, page, owner, repo } = params;
    const a = await this.octokit.graphql(
      `{
        repository(owner: "${owner}", name: "${repo}") {
          refs(first: 50,query:"${key}" ,refPrefix: "refs/heads/") {
            totalCount,
            nodes {
              name,
              target {
                ... on Commit{
                  committedDate
                }
              }
            }
          }
        }
      }`
    );
    return a;
    // const pageRes = await this.octokit.paginate(
    //   "GET /repos/{owner}/{repo}/branches",
    //   {
    //     owner,
    //     repo,
    //   }
    // );
    // const items = pageRes.slice((page - 1) * limit, page * limit);
    // return {
    //   total_count: pageRes.length,
    //   items,
    // };
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
    const res = await this.octokit.request("GET /user");
    return res.data;
  }
  async listCurrentUserRepo(params: {
    page: number;
    limit: number;
    key?: string;
  }) {
    const currentUser = await this.getCurrnetUser();
    const { page, limit, key } = params;
    const q = `user:${currentUser.login}${key ? ` ${key} in:name` : ""}`;
    const res = await this.octokit.request("GET /search/repositories", {
      page,
      q,
      per_page: limit,
    });
    return res.data;
  }
  async createRepo(params: { name: string; description?: string }) {
    const { name, description } = params;
    const repoRes = await this.octokit.request("POST /user/repos", {
      name,
      description,
    });
    console.log({ repoRes });
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
  async searchRepo(params: { page: number; limit: number; key?: string }) {
    const { limit, key, page } = params;
    const q = `${key ? ` ${key} in:name` : ""}`;
    const listRes = await this.octokit.request("GET /search/repositories", {
      page,
      q,
      per_page: limit,
    });
    return listRes;
  }
}

export const useGithubClient = async (event: H3Event) => {
  const githubTokenSession = await requireGithubTokenSession(event);
  const githubClient = new GithubClient({ token: githubTokenSession.content });
  return githubClient;
};
