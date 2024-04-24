import { z } from "zod";
import { UserRole, getCurrentUser } from "~/server/utils/user";

export const paramsSchema = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await getCurrentUser(event);
  if (!user) {
    return;
  }

  const prismaClient = usePrismaClient();
  const res = await prismaClient.app.findUnique({
    where: {
      id: data.id,
      users: {
        some: { id: user.id },
      },
    },
  });

  return res;
});

export default handler;
