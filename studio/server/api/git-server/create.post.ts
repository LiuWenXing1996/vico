import { z } from "zod";
import { GitServerType } from "~/utils/git-server";
import { requireCurrentAdminUser } from "~/server/utils/user";
import { getDbCryptoHelper } from "~/server/utils";

const paramsScheam = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(GitServerType),
  description: z.string().optional(),
  origin: z.string().url(),
  oAuthClientId: z.string().min(1),
  oAuthClientSecret: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const dbCryptoHelper = getDbCryptoHelper();
  await requireCurrentAdminUser(event);
  const data = await readValidatedBody(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prisma = usePrismaClient();
  const res = await prisma.gitServer.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
      origin: data.origin,
      oAuthClientId: data.oAuthClientId,
      oAuthClientSecret: dbCryptoHelper.encrypt(data.oAuthClientSecret),
    },
  });
  return res;
});
export default handler;
