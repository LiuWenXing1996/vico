export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session, event) => {
    const githubTokenSession = await requireGithubTokenSession(event);
    const githubClient = new GithubClient({
      token: githubTokenSession.content,
    });
    const githubUser = await githubClient.getCurrnetUser();
    await setUserSession(event, {
      user: {
        login: githubUser.login,
        id: githubUser.id,
        avatar_url: githubUser.avatar_url,
      },
    });
  });
});
