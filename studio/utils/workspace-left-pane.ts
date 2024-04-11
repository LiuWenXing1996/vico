import type { VNodeChild } from "vue";

export enum WorkspaceLeftPaneItemPosition {
  top = "top",
  bottom = "bottom",
}

export interface WorkspaceLeftPaneItem {
  key: string;
  position: WorkspaceLeftPaneItemPosition;
  label: string | (() => VNodeChild);
  title: string | (() => VNodeChild);
  titleActions?: () => VNodeChild;
  icon: () => VNodeChild;
  content: () => VNodeChild;
}

export const workspaceLeftPaneItemToMenuOption = (
  item: WorkspaceLeftPaneItem
) => {
  return {
    label: item.label,
    key: item.key,
    icon: item.icon,
  };
};

export interface WorkspaceLeftPaneItemInjectProps {}

export const defineWorkspaceLeftPaneItem = (item: WorkspaceLeftPaneItem) =>
  item;
