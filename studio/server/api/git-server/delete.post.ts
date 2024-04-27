import { z } from "zod";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prismaClient = usePrismaClient();
  await prismaClient.gitServer.delete({
    where: {
      id: data.id,
    },
  });
  return true;
});
export default handler;
