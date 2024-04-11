import type { H3Event } from "h3";
import { getH3SessionPassword } from "./h3";

interface GitServerOAuthStateSessionData {
  gitServerId: number;
  userId: number;
  state: string;
}

export const useGitServerOauthStateSession = async (event: H3Event) => {
  const maxAge = 60 * 60 * 1;
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  return await useSession<Partial<GitServerOAuthStateSessionData>>(event, {
    password: getH3SessionPassword(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      expires: new Date(expires * 1000),
      path: "/",
    },
    name: "vico-git-server-oauth-session",
  });
};
