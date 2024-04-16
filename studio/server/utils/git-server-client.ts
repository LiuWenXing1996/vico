import {
  GitServerBranch,
  GitServerRepo,
  GitServerUser,
} from "~/utils/git-server";

export abstract class GitServerClient {
  #token: string;
  get token() {
    return this.#token;
  }
  constructor(token: string) {
    this.#token = token;
  }
  abstract currentUser(): Promise<GitServerUser>;
  abstract repoList(params: {
    page: number;
    limit: number;
    key?: string;
  }): Promise<{
    total: number;
    items: GitServerRepo[];
  }>;
  abstract repoDetail(params: {
    id: string;
  }): Promise<GitServerRepo | undefined>;
  abstract repoSearch(params: {
    page: number;
    limit: number;
    key?: string;
  }): Promise<{
    total: number;
    items: GitServerRepo[];
  }>;
  abstract branchList(params: {
    repoId: string;
    page: number;
    limit: number;
    key?: string;
  }): Promise<{
    total: number;
    items: GitServerBranch[];
  }>;
  abstract branchDetail(params: {
    repoId: string;
    id: string;
  }): Promise<GitServerBranch | undefined>;
}
