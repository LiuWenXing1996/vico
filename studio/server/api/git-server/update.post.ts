import { z } from "zod";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  origin: z.string().url(),
  oAuthClientId: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prisma = usePrismaClient();
  const res = await prisma.gitServer.update({
    where: { id: data.id },
    data: {
      name: data.name,
      description: data.description,
      origin: data.origin,
      oAuthClientId: data.oAuthClientId,
    },
  });
  return res;
});
export default handler;
