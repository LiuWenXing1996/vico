import { z } from "zod";
import { checkUserAppPermission } from "~/server/utils/user";

const paramsSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1),
  appName: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await requireCurrentUser(event);
  const prismaClient = usePrismaClient();
  const app = await prismaClient.app.findUnique({
    where: {
      name: data.appName,
      isDel: false,
    },
  });
  if (!app) {
    throw createError({
      statusCode: 404,
      message: "没有找到对应的应用",
    });
  }
  const userAppPermission = await checkUserAppPermission(user, app);
  if (!userAppPermission.canEdit) {
    throw createError({
      statusCode: 403,
      message: "权限不足，无法新建版本",
    });
  }
  const res = await prismaClient.appVersion.create({
    data: {
      name: data.name,
      description: data.description,
      appId: app.id,
    },
  });
  return res;
});
export default handler;
