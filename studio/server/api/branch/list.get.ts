import { z } from "zod";

export const paramsScheam = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
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
  const githubClient = await useGithubClient(event);
  const res = await githubClient.branchList({
    page: data.page,
    limit: data.limit,
    key: data.key,
    owner: data.owner,
    repo: data.repo,
  });
  return res;
});

export default handler;
