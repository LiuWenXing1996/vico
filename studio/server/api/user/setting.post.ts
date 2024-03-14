import { z } from "zod";

const paramsScheam = z.object({
  name: z.string().min(1),
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
    const user = await prismaClient.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: data.name,
      },
    });
    return {
      id: user.id,
      name: user.name,
    };
  }
});

export default handler;
