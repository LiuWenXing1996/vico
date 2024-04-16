// import { Octokit } from "@octokit/core";
import { Octokit } from "octokit";
import { createVfs, path } from "@vico/core";
import git from "isomorphic-git";
import http from "isomorphic-git/http/web";
import JSZip from "jszip";
import type { H3Event } from "h3";
import { GitServerClient } from "./git-server-client";
import { GitServerRepo, GitServerBranch } from "~/utils/git-server";
import type { Endpoints } from "@octokit/types";

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
  constructor(token: string) {
    super(token);
    this.#octokit = new Octokit({ auth: token });
  }
  idParse(id: string) {
    try {
      const [owner, repo] = id.split("/");
      return { owner, repo };
    } catch (error) {
      throw error;
    }
  }
  idStringify(owner: string, repo: string) {
    return `${owner}/${repo}`;
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
      id: this.idStringify(repo.owner?.login || "", repo.name),
      name: repo.name,
      user: this.ownerToGitServerUser(repo.owner),
      description: repo.description || undefined,
    };
  }
  branchToGitServerBranch(branch: GithubBranch): GitServerBranch {
    return {
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
    const { owner, repo } = this.idParse(id);
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
    const { owner, repo } = this.idParse(repoId);
    const res = await this.octokit.graphql(
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
    return {
      total: res.data.repository.refs.totalCount || 0,
      items: (res.data.repository.refs.nodes || []).map((e: any) => {
        return {
          name: e.name,
        };
      }),
    };
  }
  async branchDetail(params: {
    repoId: string;
    id: string;
  }): Promise<GitServerBranch | undefined> {
    const { repoId, id } = params;
    const { owner, repo } = this.idParse(repoId);
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
}

export const useGithubClient = async (event: H3Event) => {
  const githubTokenSession = await requireGithubTokenSession(event);
  const githubClient = new GithubClient(githubTokenSession.content);
  return githubClient;
};
