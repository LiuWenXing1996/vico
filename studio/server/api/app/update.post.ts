import { z } from "zod";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
  users: z.array(z.coerce.number().min(1)).min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const user = await getCurrentUser(event);
  if (!user) {
    return;
  }

  const prismaClient = usePrismaClient();
  const res = await prismaClient.app.update({
    where: {
      id: data.id,
      users: {
        some: {
          id: user.id,
        },
      },
    },
    data: {
      name: data.name,
      description: data.description,
      users: {
        connect: data.users.map((e) => {
          return { id: e };
        }),
      },
    },
  });
  return res;
});
export default handler;
