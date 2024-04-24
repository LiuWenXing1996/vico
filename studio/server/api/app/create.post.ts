import { z } from "zod";

const paramsSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const session = await requireUserSession(event);
  const userId = session.user.id;
  const prisma = usePrismaClient();
  const res = await prisma.app.create({
    data: {
      name: data.name,
      description: data.description,
      users: { connect: { id: userId } },
    },
  });
  return res;
});
export default handler;
