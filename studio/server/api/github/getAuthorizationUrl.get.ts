import { z } from "zod";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";
import { v4 as uuidv4 } from "uuid";
import { useH3Session } from "~/server/utils/h3";

const paramsScheam = z.undefined();
export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const state = `vico_github_oauth_state_${uuidv4()}`;
  const session = await useH3Session(event);
  await session.update({
    githubOauthState: state,
  });
  const { url } = oauthAuthorizationUrl({
    clientType: "oauth-app",
    clientId: process.env.GITHUB_OAUTH_CLIENT_ID || "",
    redirectUrl: "http://localhost:3000/api/github/codeCallback",
    scopes: ["repo"],
    state: state,
  });
  return url;
});

export default handler;
