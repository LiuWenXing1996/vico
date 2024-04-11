import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

export const paramsScheam = z.object({
  key: z.string().optional(),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
export type GitServerItem = Return[0];
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const user = await getCurrentUser(event);
  if (!user) {
    return [];
  }
  const prismaClient = usePrismaClient();
  const res = await prismaClient.application.findMany({
    where: {
      name: {
        contains: data.key,
      },
      users: {
        some: { id: user.id },
      },
    },
    orderBy: [
      {
        updatedAt: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return res;
});

export default handler;
