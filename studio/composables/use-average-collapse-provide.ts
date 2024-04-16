import type { VNodeChild } from "vue";

export interface AverageCollapseItem {
  key: string;
  title: string;
}

export interface AverageCollapseProvide {
  add: (item: AverageCollapseItem) => void;
  remove: (key: string) => void;
}

const key = Symbol() as InjectionKey<AverageCollapseProvide>;

export const createAverageCollapseProvide = (value: AverageCollapseProvide) => {
  provide(key, value);
};

export const useAverageCollapseProvide = () => {
  const value = inject(key);
  return value;
};
