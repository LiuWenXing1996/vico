import { string, z } from "zod";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";
import { getGithubOauthConfig } from "~/server/utils/github";

const paramsScheam = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const dbCryptoHelper = getDbCryptoHelper();
  const user = await requireCurrentUser(event);
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const session = await useGitServerOauthStateSession(event);
  const sessionData = session.data;
  await session.clear();
  if (
    !sessionData ||
    !sessionData.gitServerId ||
    sessionData.userId !== user.id ||
    sessionData.state !== data.state
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "error callback",
    });
  }
  const primsa = usePrismaClient();
  const gitServer = await primsa.gitServer.findUnique({
    where: { id: sessionData.gitServerId },
  });
  if (!gitServer) {
    throw createError({
      statusCode: 400,
      statusMessage: "not found gitServer",
    });
  }
  const oAuthClientSecret = dbCryptoHelper.decrypt(gitServer.oAuthClientSecret);
  const tokens: any = await $fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      body: {
        client_id: gitServer.oAuthClientId,
        client_secret: oAuthClientSecret,
        code: data.code,
      },
    }
  );
  const access_token = tokens.access_token;
  return access_token;
  // const userId = event.context.user?.id;
  // if (userId) {
  //   await usePrismaClient().userSecretConfig.upsert({
  //     where: {
  //       userId,
  //     },
  //     update: {
  //       githubToken: access_token,
  //     },
  //     create: {
  //       userId,
  //       githubToken: access_token,
  //     },
  //   });
  // }
  // return sendRedirect(event, "/");
});

export default handler;
