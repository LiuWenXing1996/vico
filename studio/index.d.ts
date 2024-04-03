import type { VNodeChild } from "vue";
import type { Endpoints } from "@octokit/types";
import type { string } from "zod";

declare module "#app" {
  interface PageMeta {
    icon?: () => VNodeChild;
    order?: number;
    disableAuth?: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    uid?: string;
  }
}

declare module "#auth-utils" {
  type GithubUser = Endpoints["GET /user"]["response"]["data"];
  interface User {
    login: GithubUser["login"];
    avatar_url: GithubUser["avatar_url"];
    id: GithubUser["id"];
  }
}

declare module "h3" {
  interface H3EventContext {
    user?: {
      id: number;
    };
  }
}

// 当增强类型时，始终确保导入/导出某些内容
export {};
