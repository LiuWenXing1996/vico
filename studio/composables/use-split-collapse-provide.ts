import type { VNodeChild } from "vue";

export interface SplitCollapseItem {
  key: string;
  title: string | (() => VNodeChild);
  titleActions?: () => VNodeChild;
  content: () => VNodeChild;
}

export interface SplitCollapseProvide {
  add: (tab: SplitCollapseItem) => void;
}

const key = Symbol() as InjectionKey<SplitCollapseProvide>;

export const createSplitCollapseProvide = (value: SplitCollapseProvide) => {
  provide(key, value);
};

export const useSplitCollapseProvide = () => {
  const value = inject(key);
  return value;
};
