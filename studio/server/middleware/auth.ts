import { getServerSession } from "#auth";

export default eventHandler(async (event) => {
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  if (event.path.startsWith("/auth")) {
    return;
  }

  const session = await getServerSession(event);
  if (!session || !Number(session.uid)) {
    throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  event.context.user = {
    id: Number(session.uid),
  };
});
