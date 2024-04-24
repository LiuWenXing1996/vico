export default oauth.githubEventHandler({
  config: {
    scope: ["user:email"],
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    const prismaClient = usePrismaClient();
    let existUser = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!existUser) {
      existUser = await prismaClient.user.create({
        data: {
          name: user.login,
          email: user.email,
          avatarUrl: user.avatar_url,
        },
      });
    }

    await setUserSession(event, {
      user: {
        login: existUser.name,
        id: existUser.id,
        avatar_url: existUser.avatarUrl,
      },
    });
    return sendRedirect(event, "/studio");
  },
});
