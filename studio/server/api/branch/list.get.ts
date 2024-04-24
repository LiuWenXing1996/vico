import { z } from "zod";

export const paramsSchema = z.object({
  repoId: z.string().min(1),
  key: z.string().optional(),
  page: z.coerce.number().min(1),
  limit: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const githubClient = await useGithubClient(event);
  const res = await githubClient.branchList({
    repoId: data.repoId,
    page: data.page,
    limit: data.limit,
    key: data.key,
  });
  return res;
});

export default handler;
