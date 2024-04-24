import { Octokit } from "octokit";
import { createVfs, path } from "@vico/core";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import JSZip from "jszip";
import type { H3Event } from "h3";
import { GitServerClient } from "./git-server-client";
import { GitServerRepo, GitServerBranch } from "~/utils/git-server";
import type { Endpoints } from "@octokit/types";
import { useUserGitToken } from "~/server/utils/user";

export type GithubUser = Pick<
  Endpoints["GET /user"]["response"]["data"],
  "login" | "avatar_url"
>;
export type GithubRepo = Pick<
  Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"],
  "name" | "description" | "html_url"
> & {
  owner?: GithubUser | null;
};
export type GithubBranch = Pick<
  Endpoints["GET /repos/{owner}/{repo}/branches/{branch}"]["response"]["data"],
  "name"
>;

export class GithubClient extends GitServerClient {
  #octokit: Octokit;
  get octokit() {
    return this.#octokit;
  }
  constructor(token?: string) {
    super(token);
    this.#octokit = new Octokit({ auth: token });
  }
  repoIdParse(id: string) {
    try {
      const repoId = id ? atob(id) : "";
      const [owner, repo] = repoId.split("/");
      return { owner, repo };
    } catch (error) {
      throw error;
    }
  }
  repoIdStringify(owner: string, repo: string) {
    return btoa(`${owner}/${repo}`);
  }
  ownerToGitServerUser(owner: GithubUser | undefined | null) {
    return {
      id: owner?.login || "",
      name: owner?.login || "",
      avatarUrl: owner?.avatar_url || undefined,
    };
  }
  repoToGitServerRepo(repo: GithubRepo) {
    return {
      id: this.repoIdStringify(repo.owner?.login || "", repo.name),
      name: repo.name,
      user: this.ownerToGitServerUser(repo.owner),
      url: repo.html_url,
      description: repo.description || undefined,
    };
  }
  branchToGitServerBranch(branch: GithubBranch): GitServerBranch {
    return {
      id: branch.name,
      name: branch.name,
    };
  }
  async currentUser() {
    const res = await this.octokit.request("GET /user");
    return this.ownerToGitServerUser(res.data);
  }
  async repoList(params: {
    page: number;
    limit: number;
    key?: string | undefined;
  }): Promise<{
    total: number;
    items: GitServerRepo[];
  }> {
    const currentUser = await this.currentUser();
    const { page, limit, key } = params;
    const q = `user:${currentUser.name}${key ? ` ${key} in:name` : ""}`;
    const res = await this.octokit.request("GET /search/repositories", {
      page,
      q,
      per_page: limit,
    });
    return {
      total: res.data.total_count,
      items: res.data.items.map((e) => this.repoToGitServerRepo(e)),
    };
  }
  async repoDetail(params: { id: string }): Promise<GitServerRepo | undefined> {
    const { id } = params;
    const { owner, repo } = this.repoIdParse(id);
    const res = await this.octokit.request("GET /repos/{owner}/{repo}", {
      repo,
      owner,
    });
    return this.repoToGitServerRepo(res.data);
  }
  async repoSearch(params: {
    page: number;
    limit: number;
    key?: string | undefined;
  }) {
    const { limit, key, page } = params;
    const q = `${key ? ` ${key} in:name` : ""}`;
    const res = await this.octokit.request("GET /search/repositories", {
      page,
      q,
      per_page: limit,
    });
    return {
      total: res.data.total_count,
      items: res.data.items.map((e) => this.repoToGitServerRepo(e)),
    };
  }
  async branchList(params: {
    repoId: string;
    page: number;
    limit: number;
    key?: string | undefined;
  }): Promise<{
    total: number;
    items: GitServerBranch[];
  }> {
    const { limit, key, page, repoId } = params;
    const { owner, repo } = this.repoIdParse(repoId);
    const res = await this.octokit.graphql(
      `{
        repository(owner: "${owner}", name: "${repo}") {
          refs(first: 50 ,refPrefix: "refs/heads/") {
            totalCount,
            nodes {
              name,
              id,
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
    return {
      total: res.repository.refs.totalCount || 0,
      items: (res.repository.refs.nodes || []).map((e: any) => {
        return {
          name: e.name,
          id: e.name,
        };
      }),
    };
  }
  async branchDetail(params: {
    repoId: string;
    id: string;
  }): Promise<GitServerBranch | undefined> {
    const { repoId, id } = params;
    const { owner, repo } = this.repoIdParse(repoId);
    const res = await this.octokit.request(
      "GET /repos/{owner}/{repo}/branches/{branch}",
      {
        owner,
        repo,
        branch: id,
      }
    );
    return this.branchToGitServerBranch(res.data);
  }
  async files(params: {
    repoId: string;
    branchId: string;
  }): Promise<Blob | undefined> {
    const { repoId, branchId } = params;
    const repoDetail = await this.repoDetail({ id: repoId });
    if (!repoDetail) {
      return;
    }
    const vfs = createVfs();
    const fs = vfs.getFs();
    const baseDir = "/base";
    await git.clone({
      fs,
      http,
      dir: baseDir,
      url: repoDetail.url,
      ref: branchId,
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
    const allFiles = await git.listFiles({ fs, dir: baseDir, ref: branchId });
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
}

export const useGithubClient = async (event: H3Event) => {
  const gitToken = await useUserGitToken(event);
  const githubClient = new GithubClient(gitToken);
  return githubClient;
};
