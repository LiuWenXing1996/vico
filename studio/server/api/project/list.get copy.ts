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
  const query = await useSafeValidatedQuery(
    event,
    zod.object({
      key: zod.string().optional(),
    })
  );
  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: JSON.stringify(query.error.errors),
    });
  }
  const prismaClient = getPrismaClient();
  if (query.data.key) {
    return prismaClient.project.findMany({
      where: {
        name: {
          search: query.data.key,
        },
        authorId: userId || -1,
      },
    });
  }
  const gitlabCilent = getGitlabCilent();
  const groupId = getGitlabTopGroupId();
  const projects = await gitlabCilent.Projects.all({
    // @ts-ignore
    maxPages: 1,
    perPage: 10,
    simple: true,
    search: query,
  });
  const projects = await gitlabCilent.Groups.allProjects(groupId, {
    // @ts-ignore
    maxPages: 1,
    perPage: 10,
    simple: true,
    search: query.name,
  });
  return await prismaClient.project.findMany({
    where: {
      authorId: userId || -1,
    },
  });
});
