export default eventHandler(async (event) => {
  if (!event.path.startsWith("/api/auth")) {
    const payload = jwtVerify(event);
    if (!payload) {
      throw createError({ statusMessage: "Unauthenticated", statusCode: 403 });
    }
    event.context.auth = {
      user: {
        id: Number(payload.id),
      },
    };
  }
});
