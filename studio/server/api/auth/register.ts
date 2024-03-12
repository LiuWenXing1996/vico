import { z } from "zod";
import { cryptoPassword } from "~/server/utils";

const paramsScheam = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export type IParams = z.infer<typeof paramsScheam>;

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => {
    return paramsScheam.parse(body);
  });

  const prismaClient = getPrismaClient();
  const user = await prismaClient.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: cryptoPassword(body.password),
    },
  });
  jwtSign(event, { id: user.id, name: user.name });
  return {
    id: user.id,
    name: user.name,
  };
});
