export default oauth.githubEventHandler({
  config: {
    scope: ["repo"],
    emailRequired: true,
  },
  async onSuccess(event, { user, tokens }) {
    const dbCryptoHelper = getDbCryptoHelper();
    const prismaClient = usePrismaClient();
    let existUser = await prismaClient.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const token = tokens?.access_token;
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "undefined token",
      });
    }
    const gitToken = dbCryptoHelper.encrypt(token);
    if (!existUser) {
      existUser = await prismaClient.user.create({
        data: {
          email: user.email,
          gitToken,
        },
      });
    } else {
      await prismaClient.user.update({
        where: {
          id: existUser.id,
        },
        data: {
          gitToken,
        },
      });
    }

    await setUserSession(event, {
      user: {
        id: existUser.id,
      },
    });
    return sendRedirect(event, "/studio");
  },
});
