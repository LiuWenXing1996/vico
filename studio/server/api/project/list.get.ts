import { Octokit } from "@octokit/core";
import type { Endpoints } from "@octokit/types";
import { z } from "zod";
import { getGiteaClient } from "~/server/utils/giteaClient";

export const paramsScheam = z.object({
  key: z.string().optional(),
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubTokenSession = await getGithubTokenSession(event);
  const githubClient = new GithubClient({ token: githubTokenSession.content });
  const res = await githubClient.listCurrentUserRepo({
    page: data.page,
    limit: data.limit,
    key: data.key,
  });
  // return {
  //   s: "s",
  // };
  return res;
});

export default handler;
