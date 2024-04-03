import type { H3Event, SessionConfig } from "h3";
import { useSession, createError } from "h3";
import { defu } from "defu";

export interface GithubTokenSession {
  content: string;
}

export async function getGithubTokenSession(event: H3Event) {
  await requireUserSession(event);
  return (await _useSession(event)).data;
}
export async function setGithubTokenSession(
  event: H3Event,
  data: GithubTokenSession
) {
  const session = await _useSession(event);
  await session.update(data);
  return session.data;
}

export async function replaceGithubTokenSession(
  event: H3Event,
  data: GithubTokenSession
) {
  const session = await _useSession(event);

  await session.clear();
  await session.update(data);

  return session.data;
}

export async function clearGithubTokenSession(event: H3Event) {
  const session = await _useSession(event);

  await session.clear();

  return true;
}

export async function requireGithubTokenSession(
  event: H3Event
): Promise<GithubTokenSession> {
  const githubTokenSession = await getGithubTokenSession(event);

  if (!githubTokenSession?.content) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  return githubTokenSession;
}

let sessionConfig: SessionConfig;

function _useSession(event: H3Event) {
  if (!sessionConfig) {
    // @ts-ignore
    sessionConfig = defu(
      { password: process.env.GITHUB_TOKEN_SESSION_PASSWORD },
      useRuntimeConfig(event).session
    );
  }
  return useSession<GithubTokenSession>(event, {
    password: process.env.GITHUB_TOKEN_SESSION_PASSWORD || "",
    name: "vico-github-token-session",
  });
}
