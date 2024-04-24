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
  interface User {
    id: number;
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
