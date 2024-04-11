import { z } from "zod";
import { getDbCryptoHelper } from "~/server/utils";
import { useUserSession, UserRole } from "~/server/utils/user";

const paramsScheam = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const dbCryptoHelper = getDbCryptoHelper();
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
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
  const isFirstUser = !Boolean(await prismaClient.user.findFirst());
  const role = isFirstUser ? UserRole.admin : UserRole.user;
  const user = await prismaClient.user.create({
    data: {
      name: data.name,
      email: data.email,
      role,
      password: dbCryptoHelper.encrypt(data.password),
    },
  });
  const useSession = await useUserSession(event);
  await useSession.clear();
  await useSession.update({
    id: user.id,
  });
  return {
    id: user.id,
    name: user.name,
  };
});
export default handler;
