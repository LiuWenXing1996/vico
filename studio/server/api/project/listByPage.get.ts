import { z } from "zod";
import { getGiteaClient } from "~/server/utils/giteaClient";
import { resolveUserSecretConfigFromEvent } from "~/server/utils/user";

export const paramsScheam = z.object({
  key: z.string().optional(),
  page: z.number().min(1),
  limit: z.number().min(1),
});
export type IParams = z.infer<typeof paramsScheam>;
export type IReturn = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const userSecretConfig = await resolveUserSecretConfigFromEvent(event);
  if (userSecretConfig?.giteaToken) {
    const giteaClient = getGiteaClient(userSecretConfig?.giteaToken);
    const repo = await giteaClient.repos.repoSearch({
      q: data.key,
      template: false,
      limit: data.limit,
      page: data.page,
    });
    const total = Number(repo.headers.get("x-total-count")) || 0;
    return {
      data: repo.data.data,
      total,
    };
  }
  return {
    data: [],
    total: 0,
  };
});

export default handler;
