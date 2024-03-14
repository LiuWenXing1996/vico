import { z } from "zod";

const paramsScheam = z.object({
  giteaToken: z.string().min(1),
});

export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const currentUser = await resolveCurrentUserFromEvent(event);
  if (currentUser) {
    const prismaClient = getPrismaClient();
    await prismaClient.userSecretConfig.upsert({
      where: {
        id: currentUser.id,
      },
      update: {
        giteaToken: data.giteaToken,
      },
      create: {
        userId: currentUser.id,
        giteaToken: data.giteaToken,
      },
    });
    return true;
  }

  return false;
});

export default handler;
