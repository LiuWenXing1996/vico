import { z } from "zod";
import { getGiteaClient } from "~/server/utils/giteaClient";
import { useGithubClient } from "~/server/utils/github-client";
import { resolveUserSecretConfigFromEvent } from "~/server/utils/user";

export const paramsScheam = z.object({
  key: z.string().optional(),
  page: z.number().min(1),
  limit: z.number().min(1),
});
export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const ddd =getQuery(event)
  console.log(ddd)
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubClient = await useGithubClient(event);
  const res = await githubClient.repoList({
    page: data.page,
    limit: data.limit,
  });

  return {
    data: res,
    total: 0,
  };
});

export default handler;
