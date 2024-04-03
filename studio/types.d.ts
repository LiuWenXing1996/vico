import type { Endpoints } from "@octokit/types";

export type MaybePromise<T> = T | Promise<T>;
export type GitHubRepo =
  Endpoints["GET /search/repositories"]["response"]["data"]["items"][0];
