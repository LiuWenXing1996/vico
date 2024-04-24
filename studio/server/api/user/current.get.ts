import { z } from "zod";

const paramsSchema = z.undefined();
export type Params = z.infer<typeof paramsSchema>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const githubClient = await useGithubClient(event);
  const user = await githubClient.currentUser();
  return user;
});

export default handler;
