import { z } from "zod";
import { requireCurrentAdminUser } from "~/server/utils/user";

export const paramsScheam = z.object({
  key: z.string().optional(),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  await requireCurrentUser(event);
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prismaClient = usePrismaClient();
  const res = await prismaClient.gitServer.findMany({
    where: {
      name: {
        contains: data.key,
      },
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const resMasked = res.map((e) => {
    e.oAuthClientSecret = "***";
    return {
      ...e,
    };
  });

  return resMasked;
});

export default handler;
