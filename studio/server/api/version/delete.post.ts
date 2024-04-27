import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await requireCurrentUser(event);
  const userId = user.id;
  const prismaClient = usePrismaClient();
  await prismaClient.app.deleteMany({
    where: {
      id: data.id,
      owners: {
        some: { id: userId },
      },
    },
  });
  return true;
});
export default handler;
