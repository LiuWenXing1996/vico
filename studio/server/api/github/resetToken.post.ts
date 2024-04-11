import { z } from "zod";
import { oauthAuthorizationUrl } from "@octokit/oauth-authorization-url";

const paramsScheam = z.object({});

export type Params = z.infer<typeof paramsScheam>;
export type Return = Awaited<ReturnType<typeof handler>>;
const handler = defineEventHandler(async (event) => {
  const { url, clientId, redirectUrl, login, scopes, state } =
    oauthAuthorizationUrl({
      clientType: "oauth-app",
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID || "",
      redirectUrl: "https://example.com",
      scopes: ["repo"],
      state: process.env.GITHUB_OAUTH_STATE || "",
    });
  return sendRedirect(event, url);
});

export default handler;
