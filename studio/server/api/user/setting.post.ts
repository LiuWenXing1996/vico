import { z } from "zod";

const paramsScheam = z.object({
  name: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const currentUser = await resolveCurrentUserFromEvent(event);
  if (currentUser) {
    const prismaClient = usePrismaClient();
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
