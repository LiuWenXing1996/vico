import { z } from "zod";
import { ProjectModel } from "~/server/models/project";
import { cryptoPassword, getJwtTokenSecret } from "~/server/utils";
import jwt from "jsonwebtoken";
import { jwtSign } from "~/server/utils/jwt";
import { useUserSession } from "~/server/utils/user";

const paramsScheam = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;

export default defineEventHandler(async (event) => {
  const dbCryptoHelper = getDbCryptoHelper();
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prismaClient = usePrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      name: data.name,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "用户不存在",
    });
  }
  const decryptPassword = dbCryptoHelper.decrypt(user.password);
  if (data.password !== decryptPassword) {
    throw createError({
      statusCode: 401,
      message: "密码错误",
    });
  }
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
