import { z } from "zod";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";
import { v4 as uuidv4 } from "uuid";
import { GitServerType } from "~/utils/git-server";

const paramsScheam = z.object({
  id: z.coerce.number().min(1),
});
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const user = await requireCurrentUser(event);
  const data = await getValidatedQuery(event, (data) => {
    return paramsScheam.parse(data);
  });
  const primsa = usePrismaClient();
  const gitServer = await primsa.gitServer.findUnique({
    where: { id: data.id },
  });
  const state = `vico_git_server_oauth_state_${uuidv4()}`;
  const session = await useGitServerOauthStateSession(event);
  await session.update({
    state,
    gitServerId: data.id,
    userId: user.id,
  });
  let url = "";
  if (GitServerType.github === gitServer?.type) {
    const urlObject = oauthAuthorizationUrl({
      clientType: "oauth-app",
      clientId: gitServer.oAuthClientId,
      redirectUrl: "http://localhost:3000/api/git-server/oauth/code-callback",
      scopes: ["repo"],
      state: state,
    });
    url = urlObject.url;
  }
  return url;
});

export default handler;
