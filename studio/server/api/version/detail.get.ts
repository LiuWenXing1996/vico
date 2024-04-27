import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

export const paramsSchema = z.object({
  name: z.string().min(1),
  appName: z.string().min(1),
});
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
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
    return;
  }
  const userAppPermission = await checkUserAppPermission(user, app);
  if (!userAppPermission.canRead) {
    return;
  }

  const res = await prismaClient.appVersion.findFirst({
    where: {
      name: data.name,
      appId: app.id,
      isDel: false,
    },
  });

  return res;
});
