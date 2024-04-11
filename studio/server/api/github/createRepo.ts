import { z } from "zod";

const paramsScheam = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateOwner: z.string().min(1),
  templateRepo: z.string().min(1),
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
    const userRes = await giteaClient.user.userGetCurrent();
    const user = userRes.data;
    if (user.login_name) {
      const repoRes = await giteaClient.repos.generateRepo(
        data.templateOwner,
        data.templateRepo,
        {
          default_branch: "main",
          description: data.description,
          name: data.name,
          owner: user.login_name,
        }
      );
      return repoRes.data;
    }
  }
});
export default handler;
