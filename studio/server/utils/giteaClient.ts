import { giteaApi } from "gitea-js";

const getGiteaAdminToken = () => {
  const token = process.env.GITEA_ADMIN_TOKEN;
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITEA_ADMIN_TOKEN",
    });
  }
  return token;
};

const getGiteaBaseUrl = () => {
  const baseUrl = process.env.GITEA_BASE_URL;
  if (!baseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITEA_BASE_URL",
    });
  }
  return baseUrl;
};

export const getGiteaClient = (token?: string | null) => {
  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: "undefined GITEA_TOKEN",
    });
  }
  return giteaApi(getGiteaBaseUrl(), {
    token: token,
    customFetch: fetch,
  });
};

export const getGiteaClientAdmin = () => {
  return giteaApi(getGiteaBaseUrl(), {
    token: getGiteaAdminToken(),
  });
};
