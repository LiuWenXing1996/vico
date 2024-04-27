import { Gitlab } from "@gitbeaker/rest";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import type { H3Event } from "h3";
import { defu } from "defu";
import CryptoJS from "crypto-js";
import { createFsUtils } from "@vico/core";
import fsPromises from "node:fs/promises";
import path from "node:path";

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

export const usePrismaClient = () => {
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

export const useGithubTokenSession = async (event: H3Event) => {
  const sessionConfig = defu(
    { password: process.env.NUXT_SESSION_PASSWORD },
    useRuntimeConfig(event).session
  ) as any;
  return useSession<{
    value: string;
  }>(event, sessionConfig);
};

export const getDbCryptoHelper = () => {
  const password = process.env.DATABASE_CRYPTO_PASSWORD;
  if (!password) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined DATABASE_CRYPTO_PASSWORD",
    });
  }
  return {
    decrypt: (value: string) => {
      return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
    },
    encrypt: (value: string) => {
      return CryptoJS.AES.encrypt(value, password).toString();
    },
  };
};

export const getAppTpl = async () => {
  const fsUtils = createFsUtils(fsPromises);
  const appTplDataDir = path.join(process.cwd(), "./server/data/app-tpl");
  const appTplFiles = await fsUtils.listFiles(appTplDataDir);
  const appTpl = await Promise.all(
    appTplFiles.map(async (filePath) => {
      const content = await fsUtils.readFile(filePath, "utf-8");
      return {
        path: path.relative(appTplDataDir, filePath),
        content,
      };
    })
  );
  return appTpl;
};
