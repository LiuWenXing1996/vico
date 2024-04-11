import { z } from "zod";

const paramsScheam = z.object({
  owner: z.string().min(1),
  repo: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const userSecretConfig = await resolveUserSecretConfigFromEvent(event);
  if (userSecretConfig?.giteaToken) {
    const giteaClient = getGiteaClient(userSecretConfig?.giteaToken);
    await giteaClient.repos.repoDelete(data.owner, data.repo);
    return true;
  }

  return false;
});

export default handler;
