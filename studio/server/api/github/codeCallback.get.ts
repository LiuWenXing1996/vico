import { string, z } from "zod";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";
import { getGithubOauthConfig } from "~/server/utils/github";
import { useH3Session } from "~/server/utils/h3";

const paramsScheam = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const session = await useH3Session(event);
  const stateInSession = session.data.githubOauthState;
  if (stateInSession !== data.state) {
    throw createError({
      statusCode: 400,
      statusMessage: "error state",
    });
  }
  session.update({
    githubOauthState: undefined,
  });

  const oauthConfig = getGithubOauthConfig();
  const tokens: any = await $fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      body: {
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
        code: data.code,
      },
    }
  );
  const access_token = tokens.access_token;
  const userId = event.context.user?.id;
  if (userId) {
    await usePrismaClient().userSecretConfig.upsert({
      where: {
        userId,
      },
      update: {
        githubToken: access_token,
      },
      create: {
        userId,
        githubToken: access_token,
      },
    });
  }
  return sendRedirect(event, "/");
});

export default handler;
