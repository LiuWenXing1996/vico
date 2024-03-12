import { Gitlab } from "@gitbeaker/rest";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import type { H3Event, EventHandlerRequest } from "h3";

let prismaClient: PrismaClient | null = null;

export const getGitlabCilent = (token?: string | null) => {
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITLAB_TOKEN",
    });
  }
  return new Gitlab({
    host: "https://gitlab.com/",
    token: token,
  });
};

export const getPrismaClient = () => {
  if (prismaClient) {
    return prismaClient;
  }
  prismaClient = new PrismaClient();
  return prismaClient;
};

export const getGitlabTopGroupId = () => {
  const id = Number(process.env.GITLAB_TOP_GROUP_ID);
  if (!id) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITLAB_TOP_GROUP_ID",
    });
  }
  return id;
};

export const cryptoPassword = (password: string) => {
  const _password = md5(md5(password));
  return _password;
};

export const getJwtTokenSecret = () => {
  const secret = process.env.JWT_TOKEN_SECRET;
  if (!secret) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined JWT_TOKEN_SECRET",
    });
  }
  return secret;
};

export const resolveCurrentUserFromEvent = async (
  event: H3Event<EventHandlerRequest>
) => {
  const userId = event.context.auth.user.id;
  const prismaClient = getPrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined user",
    });
  }
  return user;
};
