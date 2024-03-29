import type { VNodeChild } from "vue";

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

declare module "h3" {
  interface H3EventContext {
    user?: {
      id: number;
    };
  }
}

// 当增强类型时，始终确保导入/导出某些内容
export {};
