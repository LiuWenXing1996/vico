import { useGithubTokenSession } from "~/server/utils";
import { setGithubTokenSession } from "~/server/utils/github-token-session";
import type { Endpoints } from "@octokit/types";

type GithubUser = Endpoints["GET /user"]["response"]["data"];

export default oauth.githubEventHandler({
  config: {
    scope: ["repo"],
  },
  async onSuccess(event, { user, tokens }) {
    const githubUser = user as GithubUser;
    await setUserSession(event, {
      user: {
        login: githubUser.login,
        id: githubUser.id,
        avatar_url: githubUser.avatar_url,
      },
    });
    await setGithubTokenSession(event, { content: tokens?.access_token });
    return sendRedirect(event, "/studio");
  },
  async onError(event, error) {
    return sendRedirect(event, "/studio");
  },
});
