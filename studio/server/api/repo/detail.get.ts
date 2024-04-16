import { z } from "zod";

export const paramsScheam = z.object({
  id: z.coerce.string().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubClient = await useGithubClient(event);
  const res = await githubClient.repoDetail({ id: data.id });
  return res;
});

export default handler;
