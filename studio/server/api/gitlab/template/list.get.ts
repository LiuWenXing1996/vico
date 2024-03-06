import { z } from "zod";
import { getGitlabCilent } from "~/utils";

const paramsSchema = z.object({
  name: z.string().optional(),
});

export type IIGitlabTemplateListParams = z.infer<typeof paramsSchema>;
export type IGitlabTemplateListReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (query) => {
    return paramsSchema.parse(query);
  });
  const gitlabCilent = getGitlabCilent();
  const projects = await gitlabCilent.Projects.all({
    // @ts-ignore
    maxPages: 1,
    perPage: 10,
    simple: true,
    search: query.name,
  });

  return projects;
});
export default handler;
