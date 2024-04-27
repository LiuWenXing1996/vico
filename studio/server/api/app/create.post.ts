import { z } from "zod";

const paramsSchema = z.object({
  description: z.string().optional(),
  name: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });
  const user = await requireCurrentUser(event);
  const prismaClient = usePrismaClient();
  const appTpl = await getAppTpl();
  const app = await prismaClient.app.create({
    data: {
      name: data.name,
      description: data.description,
      owners: { connect: { id: user.id } },
    },
  });
  const version = await prismaClient.appVersion.create({
    data: {
      name: "first-version",
      description: "first-version",
      appId: app.id,
      createUserId: user.id,
    },
  });
  await prismaClient.appVersionHistory.create({
    data: {
      name: "first-version",
      description: "first-version",
      appVersionId: version.id,
      createUserId: user.id,
      content: Buffer.from(JSON.stringify(appTpl), "utf8"),
    },
  });
  return app;
});
export default handler;
