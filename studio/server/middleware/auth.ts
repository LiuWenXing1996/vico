import { getServerSession, getToken } from "#auth";
export default eventHandler(async (event) => {
  if (!event.path.startsWith("/api/auth")) {
    const token = await getToken({ event });
    if (!token) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    event.context.auth = {
      user: {
        id: Number(token.id),
      },
    };
  }
});
