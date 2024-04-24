import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

export const paramsSchema = z.object({
  key: z.string().optional(),
});
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
export type GitServerItem = Return[0];
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const session = await getUserSession(event);
  const userId = session.user?.id;
  if (!userId) {
    return [];
  }
  const prismaClient = usePrismaClient();
  const res = await prismaClient.app.findMany({
    where: {
      name: {
        contains: data.key,
      },
      users: {
        some: { id: userId },
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
