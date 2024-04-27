import { z } from "zod";

const paramsSchema = z.object({
  appName: z.string().min(1),
  versionName: z.string().min(1),
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
    throw createError({
      statusCode: 404,
      message: "没有找到对应的应用",
    });
  }
  const userAppPermission = await checkUserAppPermission(user, app);
  if (!userAppPermission.canRead) {
    throw createError({
      statusCode: 403,
      message: "权限不足，无法查看文件",
    });
  }
  const appVersion = await prismaClient.appVersion.findFirst({
    where: {
      name: data.versionName,
      appId: app.id,
      isDel: false,
    },
  });
  if (!appVersion) {
    throw createError({
      statusCode: 404,
      message: "没有找到对应的版本",
    });
  }
  const appVersionHistory = await prismaClient.appVersionHistory.findFirst({
    where: {
      appVersionId: appVersion.id,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  const content = appVersionHistory?.content.toString("utf-8") || "";
  let res: {
    path: string;
    content: string;
  }[] = [];
  try {
    res = JSON.parse(content);
  } catch (error) {}
  return res;
});
