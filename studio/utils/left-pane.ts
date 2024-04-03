import type { MenuOption } from "naive-ui";
import type { VNodeChild } from "vue";

export interface ILeftPane {
  key: string;
  label: MenuOption["label"];
  icon: () => VNodeChild;
  onSelect?: (key: string, item: ILeftPane) => void;
  content?: () => VNodeChild;
  children?: ILeftPane[];
}
export const defineLeftPane = (pane: ILeftPane) => pane;
