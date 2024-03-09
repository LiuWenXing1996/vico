import { Gitlab } from "@gitbeaker/rest";
import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | null = null;

export const getGitlabCilent = () => {
  return new Gitlab({
    host: "https://gitlab.com/",
    token: process.env.GITLAB_TOKEN || "",
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
