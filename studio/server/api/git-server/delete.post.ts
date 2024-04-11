import { z } from "zod";
import { requireCurrentAdminUser } from "~/server/utils/user";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  await requireCurrentAdminUser(event);
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prisma = usePrismaClient();
  await prisma.gitServer.delete({
    where: {
      id: data.id,
    },
  });
  return true;
});
export default handler;
