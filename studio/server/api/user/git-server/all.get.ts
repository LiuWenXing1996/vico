import { omit, sift } from "radash";
import { z } from "zod";

export const paramsScheam = z.object({
  key: z.string().optional(),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const user = await requireCurrentUser(event);
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const prismaClient = usePrismaClient();
  const gitServerList = (
    await prismaClient.gitServer.findMany({
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    })
  ).map((e) => omit(e, ["oAuthClientSecret"]));
  const userConfigList = (
    await prismaClient.usersOnGitServers.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        {
          updatedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    })
  )
    .map((e) => omit(e, ["token"]))
    .map((e) => {
      const gitServer = gitServerList.find((g) => g.id === e.gitServerId);
      if (gitServer) {
        return {
          gitServer,
          config: e,
        };
      }
    });
  const gitServerRestList = gitServerList.filter(
    (e) => !userConfigList.find((u) => u?.gitServer.id === e.id)
  );
  const res = sift([
    ...userConfigList,
    ...gitServerRestList.map((e) => {
      return {
        gitServer: e,
        config: null,
      };
    }),
  ]);


  return res;
});

export default handler;
