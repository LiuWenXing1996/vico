import { z } from "zod";
import { getCurrentUser } from "~/server/utils/user";

const paramsScheam = z.undefined();
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  return user;
});

export default handler;
