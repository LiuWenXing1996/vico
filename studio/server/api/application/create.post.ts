import { z } from "zod";
import { GitServerType } from "~/utils/git-server";

const paramsScheam = z.object({
  description: z.string().optional(),
  name: z.string().min(1),
  gitServerId: z.coerce.number().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const user = await getCurrentUser(event);
  if (!user) {
    return;
  }

  const prisma = usePrismaClient();
  const res = await prisma.application.create({
    data: {
      name: data.name,
      description: data.description,
      users: { connect: { id: user.id } },
      gitServer: { connect: { id: data.gitServerId } },
    },
  });
  return res;
});
export default handler;
