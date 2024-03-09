import { useSafeValidatedQuery } from "h3-zod";
import zod from "zod";
import { getGitlabTopGroupId, getPrismaClient } from "~/server/utils";


export default defineEventHandler(async (event) => {
  const userId = event.context.auth.user.id;
  const data = await getValidatedQuery(event, (data) => {
    return zod
      .object({
        key: zod.string().optional(),
      })
      .parse(data);
  });
  

  const gitlabCilent = getGitlabCilent();
  const groupId = getGitlabTopGroupId();
  const projects = await gitlabCilent.Groups.allProjects(groupId, {
    // @ts-ignore
    maxPages: 1,
    perPage: 10,
    simple: true,
    search: data.key,
  });
  return projects
});
