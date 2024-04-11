import { z } from "zod";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const currnetUser = await requireCurrentUser(event);

  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  if (currnetUser.id !== data.id) {
    throw createError({
      statusCode: 401,
      statusMessage: "用户无修改权限",
    });
  }
  const prismaClient = usePrismaClient();
  const userNameFound = await prismaClient.user.findUnique({
    where: {
      name: data.name,
    },
  });
  if (userNameFound) {
    throw createError({
      statusCode: 400,
      statusMessage: "用户名称已存在",
    });
  }
  const userEmailFound = await prismaClient.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (userEmailFound) {
    throw createError({
      statusCode: 400,
      statusMessage: "用户邮箱已存在",
    });
  }

  const user = await prismaClient.user.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return {
    id: user.id,
    name: user.name,
  };
});
export default handler;
