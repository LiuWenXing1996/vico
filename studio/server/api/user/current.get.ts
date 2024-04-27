import { z } from "zod";

const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const user = await getCurrentUser(event);
  return user;
});
