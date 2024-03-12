import { z } from "zod";
import { resolveCurrentUserFromEvent } from "~/server/utils";
import { giteaApi } from "gitea-js";
import fetch from "cross-fetch";
import { getGiteaClient } from "~/server/utils/giteaClient";

export const paramsScheam = z.object({
  key: z.string().optional(),
});
export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const currentUser = await resolveCurrentUserFromEvent(event);
  const giteaClient = getGiteaClient(currentUser.gitlabToken)
  const repo = await giteaClient.repos.repoSearch();
  // console.log(repo.data.data);

  // const gitlabCilent = getGitlabCilent(currentUser.gitlabToken);
  // const projects = await gitlabCilent.Projects.all({
  //   // @ts-ignore
  //   maxPages: 1,
  //   perPage: 10,
  //   simple: true,
  //   search: data.key,
  // });
  // return projects;
  return repo.data.data
});

export default handler;
