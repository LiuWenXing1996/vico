export default eventHandler(async (event) => {
  if (!(event.path.startsWith("/api/auth") || event.path.startsWith("/auth"))) {
    const payload = jwtVerify(event);
    if (!payload) {
      await sendRedirect(event, "/auth/login", 302);
      throw createError({ statusMessage: "Unauthenticated", statusCode: 302 });
    }
    setUserDataToEvent(event, { id: Number(payload.id) });
  }
});
