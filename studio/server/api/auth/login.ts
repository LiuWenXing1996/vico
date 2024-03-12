import { z } from "zod";
import { ProjectModel } from "~/server/models/project";
import { cryptoPassword, getJwtTokenSecret } from "~/server/utils";
import jwt from "jsonwebtoken";
import { jwtSign } from "~/server/utils/jwt";

const paramsScheam = z.object({
  name: z.string().min(1),
  password: z.string().min(8),
});

export type IParams = z.infer<typeof paramsScheam>;

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => {
    return paramsScheam.parse(body);
  });
  const password = cryptoPassword(body.password);
  const prismaClient = getPrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      name: body.name,
      password: password,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "用户不存在或密码错误",
    });
  }
  jwtSign(event, { id: user.id, name: user.name });

  return {
    id: user.id,
    name: user.name,
  };
});
