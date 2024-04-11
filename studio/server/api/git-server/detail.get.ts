import { z } from "zod";

export const paramsScheam = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  await requireCurrentAdminUser(event);
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prismaClient = usePrismaClient();
  const res = await prismaClient.gitServer.findUnique({
    where: {
      id: data.id,
    },
  });
  if (res) {
    res.oAuthClientSecret = "***";
  }

  return res;
});

export default handler;
