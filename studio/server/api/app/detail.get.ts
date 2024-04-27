import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

export const paramsSchema = z.object({
  name: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const prismaClient = usePrismaClient();
  const user = await getCurrentUser(event);
  if (!user) {
    return;
  }

  const res = await prismaClient.app.findUnique({
    where: {
      name: data.name,
      OR: [
        {
          owners: {
            some: { id: user.id },
          },
        },
        {
          developers: {
            some: { id: user.id },
          },
        },
      ],
    },
  });

  return res;
});
