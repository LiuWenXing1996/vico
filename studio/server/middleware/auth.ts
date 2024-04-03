export default eventHandler(async (event) => {
  if (event.path.startsWith("/api/auth")) {
    return;
  }

  if (event.path.startsWith("/auth")) {
    return;
  }

  const session = await getUserSession(event);
  if (!session.user) {
    // throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
  }
  // event.context.user = {
  //   id: Number(session.uid),
  // };
});
