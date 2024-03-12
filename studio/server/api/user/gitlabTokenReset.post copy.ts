import { z } from "zod";
import { resolveCurrentUserFromEvent } from "~/server/utils";

const paramsScheam = z.object({
  gitlabToken: z.string().min(1),
});

export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const currentUser = await resolveCurrentUserFromEvent(event);

  const prismaClient = getPrismaClient();
  const user = await prismaClient.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      gitlabToken: data.gitlabToken,
    },
  });
  return true;
});

export default handler;
