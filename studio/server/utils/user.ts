import { App, User } from "@prisma/client";
import type { H3Event } from "h3";

interface UserSessionData {
  id: string;
}

export const useUserSession = async (event: H3Event) => {
  const maxAge = 60 * 60 * 24 * 7;
  const expires = Math.floor(Date.now() / 1000) + maxAge;
  return await useSession<Partial<UserSessionData>>(event, {
    password: getUserSessionPassword(),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
      expires: new Date(expires * 1000),
      path: "/",
    },
    name: "vico-user-token-session",
  });
};

const getUserSessionPassword = () => {
  const password = process.env.USER_SESSION_PASSWORD;
  if (!password) {
    throw createError({
      statusCode: 500,
      message: "undefined USER_SESSION_PASSWORD",
    });
  }
  return password;
};

export const getCurrentUser = async (event: H3Event) => {
  const userSession = await useUserSession(event);
  const userId = userSession.data.id;
  if (!userId) {
    return;
  }
  const prismaClient = usePrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user) {
    user.password = "***";
  }
  return user;
};

export const requireCurrentUser = async (event: H3Event) => {
  const user = await getCurrentUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "用户未登录",
    });
  }
  return user;
};

export const checkUserAppPermission = async (
  user?: User | null,
  app?: App | null
) => {
  if (!app) {
    return {};
  }
  if (!user) {
    if (app.isPublic) {
      return {
        canRead: true,
      };
    } else {
      return {};
    }
  }
  const prismaClient = usePrismaClient();
  const userApps = await prismaClient.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      devApps: true,
      ownApps: true,
    },
  });
  if (userApps?.ownApps.find((e) => e.id === app.id)) {
    return {
      canRead: true,
      canEdit: true,
      canDel: true,
    };
  }
  if (userApps?.devApps.find((e) => e.id === app.id)) {
    return {
      canRead: true,
      canEdit: true,
    };
  }
  return {};
};

export const getUserApps = () => {};

export const getUserAppDetail = () => {};
