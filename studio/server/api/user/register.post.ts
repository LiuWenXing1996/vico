import { z } from "zod";
import { getDbCryptoHelper } from "~/server/utils";
import { useUserSession, UserRole } from "~/server/utils/user";

const paramsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const dbCryptoHelper = getDbCryptoHelper();
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
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
  const user = await prismaClient.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: dbCryptoHelper.encrypt(data.password),
    },
  });
  const useSession = await useUserSession(event);
  await useSession.clear();
  await useSession.update({
    id: user.id,
  });
  return true;
});
