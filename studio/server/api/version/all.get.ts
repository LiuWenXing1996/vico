import { z } from "zod";
import { checkUserAppPermission, getCurrentUser } from "~/server/utils/user";

export const paramsSchema = z.object({
  key: z.string().optional(),
  appName: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
export type GitServerItem = Return[0];
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await getCurrentUser(event);
  const prismaClient = usePrismaClient();
  const app = await prismaClient.app.findUnique({
    where: {
      name: data.appName,
      isDel: false,
    },
  });
  if (!app) {
    return [];
  }
  const userAppPermission = await checkUserAppPermission(user, app);
  if (!userAppPermission.canRead) {
    return [];
  }
  const res = await prismaClient.appVersion.findMany({
    where: {
      name: {
        contains: data.key,
      },
      appId: app.id,
    },
    orderBy: [
      {
        updatedAt: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return res;
});

export default handler;
