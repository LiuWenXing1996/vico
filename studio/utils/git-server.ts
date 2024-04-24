export enum GitServerType {
  github = "github",
  gitlab = "gitlab",
  gitea = "gitea",
}

export interface GitServerUser {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface GitServerRepo {
  id: string;
  name: string;
  user: GitServerUser;
  url: string;
  description?: string;
}

export interface GitServerBranch {
  name: string;
  id: string;
}
