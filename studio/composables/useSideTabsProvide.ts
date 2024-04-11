import type { VNodeChild } from "vue";

export enum SideTabPosition {
  top = "top",
  bottom = "bottom",
}

export interface SideTab {
  position: SideTabPosition;
  key: string;
  label: string | (() => VNodeChild);
  icon: () => VNodeChild;
}

export const sideTabToMenuOption = (item: SideTab) => {
  return {
    label: item.label,
    key: item.key,
    icon: item.icon,
  };
};

export interface SideTabsProvide {
  addTab: (tab: SideTab) => void;
  currentTabKey: ComputedRef<string | undefined>;
}

const key = Symbol() as InjectionKey<SideTabsProvide>;

export const createSideTabsProvide = (value: SideTabsProvide) => {
  provide(key, value);
};

export default () => {
  const value = inject(key);
  return value;
};
