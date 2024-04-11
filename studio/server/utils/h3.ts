import type { H3Event } from "h3";

export const useH3Session = async (event: H3Event) => {
  const session = await useSession<{
    githubOauthState?: string;
  }>(event, {
    password: process.env.H3_SESSION_PASSWORD || "",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return session;
};

export const getH3SessionPassword = () => {
  const password = process.env.H3_SESSION_PASSWORD;
  if (!password) {
    throw createError({
      statusCode: 500,
      message: "undefined H3_SESSION_PASSWORD",
    });
  }
  return password;
};
