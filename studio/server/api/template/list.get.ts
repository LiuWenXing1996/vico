import { z } from "zod";


export const paramsScheam = z.object({
  key: z.string().optional(),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  // const userSecretConfig = await resolveUserSecretConfigFromEvent(event);
  // if (userSecretConfig?.giteaToken) {
  //   const giteaClient = getGiteaClient(userSecretConfig?.giteaToken);
  //   const repo = await giteaClient.repos.repoSearch({
  //     q: data.key,
  //   });
  //   return repo.data.data;
  // }
  return [];
});

export default handler;
