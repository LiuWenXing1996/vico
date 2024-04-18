import { z } from "zod";

const paramsScheam = z.object({
  repoId: z.string().min(1),
  branchId: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const githubClient = await useGithubClient(event);

  const res = await githubClient.files({
    repoId: data.repoId,
    branchId: data.branchId,
  });
  return res;
});
export default handler;
