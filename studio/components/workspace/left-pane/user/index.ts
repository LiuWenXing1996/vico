import { RepoList, WorkspaceLeftPaneUserIcon } from "#components";
import { useDialog } from "naive-ui";
import { defineLeftPane } from "~/utils/left-pane";
const dialog = useDialog();

export default defineLeftPane({
  key: "user",
  label: "用户",
  icon: () => h(WorkspaceLeftPaneUserIcon),
  children: [
    defineLeftPane({
      label: "仓库列表",
      key: "user-repo-list",
      icon: renderIcon("repository"),
      content: () => h(WorkspaceLeftPaneUserIcon),
    }),
  ],
});
