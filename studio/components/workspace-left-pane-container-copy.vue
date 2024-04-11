<template>
  <n-layout has-sider>
    <n-layout-sider bordered :width="64">
      <div class="menus-wrapper">
        <n-menu :options="topMenuOptions" v-bind="commonMenuProps" />
        <n-menu :options="bottomMenuOptions" v-bind="commonMenuProps" />
      </div>
    </n-layout-sider>
    <div class="left-content">
      <div v-for="item in items" class="left-pane-item-wrapper">
        <div class="left-pane-item-content" v-show="selectedKey === item.key">
          <div class="left-pane-item-title-wrapper">
            <div class="left-pane-item-title">
              <template v-if="isString(item.title)">
                {{ item.title }}
              </template>
              <template v-else>
                <component :is="item.title"></component>
              </template>
            </div>
            <div v-if="item.titleActions" class="left-pane-item-title-actions">
              <component :is="item.titleActions"></component>
            </div>
          </div>
          <div class="left-pane-item-body">
            <component :is="item.content"></component>
          </div>
        </div>
      </div>
    </div>
  </n-layout>
</template>

<script setup lang="tsx">
import type { Component, VNodeChild } from "vue";
import type { MenuOption, MenuProps } from "naive-ui";
import {
  ApplicationList,
  DialogContentWrapper,
  GitServerList,
  NuxtIcon,
  RepoList,
  UserIcon,
  UserLogin,
} from "#components";
import { isString } from "radash";
const props = withDefaults(
  defineProps<{
    items?: WorkspaceLeftPaneItem[];
  }>(),
  {
    items: () => [],
  }
);
const { items } = toRefs(props);

const topMenuOptions = computed<MenuOption[]>(() => {
  return items.value
    .filter((e) => e.position === WorkspaceLeftPaneItemPosition.top)
    .map((e) => workspaceLeftPaneItemToMenuOption(e));
});
const bottomMenuOptions = computed<MenuOption[]>(() => {
  return items.value
    .filter((e) => e.position === WorkspaceLeftPaneItemPosition.bottom)
    .map((e) => workspaceLeftPaneItemToMenuOption(e));
});
const commonMenuProps = computed<MenuProps>(() => {
  return {
    collapsed: true,
    collapsedWidth: 64,
    collapsedIconSize: 22,
    value: selectedKey.value,
    onUpdateValue: handleMenuSelect,
  };
});
const { loggedIn, logout } = useAuth();
const dialog = useDialog();
const themeVars = useThemeVars();

type IMenuOptionExtend = MenuOption & {
  onSelect?: (key: string, item: IMenuOptionExtend) => void;
  content?: () => VNodeChild;
  children?: IMenuOptionExtend[];
};

const menuConifg = computed<{
  top: IMenuOptionExtend[];
  bottom: IMenuOptionExtend[];
}>(() => {
  return {
    top: [
      {
        label: "文件管理器",
        key: "file-manager",
        icon: renderIcon("files"),
        content: () => h("span", "文件管理器"),
      },
      {
        label: "搜索",
        key: "search",
        icon: renderIcon("search"),
        content: () => h("span", "搜索"),
      },
      {
        label: "git服务器列表",
        key: "git-server-list",
        icon: renderIcon("git-server"),
        content: () => h(GitServerList),
      },
      {
        label: "应用列表",
        key: "app-list",
        icon: renderIcon("app-list"),
        content: () => h(ApplicationList),
      },
    ],
    bottom: [
      {
        label: "用户",
        key: "user",
        icon: () => h(UserIcon),
        children: [
          {
            label: "仓库列表",
            key: "project",
            icon: renderIcon("repository"),
            onSelect: () => {
              dialog.create({
                showIcon: false,
                style: {
                  width: "80vw",
                },
                title: "仓库列表",
                content: () => {
                  return h(
                    DialogContentWrapper,
                    {
                      style: {
                        paddingTop: "20px",
                        boxSizing: "border-box",
                      },
                    },
                    h(RepoList, { height: "70vh" })
                  );
                },
              });
            },
          },
          loggedIn.value
            ? {
                label: "退出登录",
                key: "logout",
                icon: renderIcon("logout"),
                onSelect: () => {
                  dialog.warning({
                    title: "退出登录",
                    content: "确定退出登录吗？",
                    positiveText: "确定",
                    negativeText: "不确定",
                    onPositiveClick: async () => {
                      await logout();
                    },
                    onNegativeClick: () => {},
                  });
                },
              }
            : {
                label: "登录",
                key: "login",
                icon: renderIcon("login"),
                onSelect: async () => {
                  const dialogIns = dialog.create({
                    showIcon: false,
                    style: {
                      width: "510px",
                    },
                    content: () => {
                      return h(UserLogin, {
                        onSucess: () => {
                          dialogIns.destroy();
                        },
                      });
                    },
                  });
                },
              },
        ],
      },
    ],
  };
});
const selectedKey = ref(menuConifg.value.top[0].key);
const selectedContent = computed(() => {
  const topContent = findContent(selectedKey.value, menuConifg.value.top);
  if (topContent) {
    return topContent;
  }
  const bottomContent = findContent(selectedKey.value, menuConifg.value.top);
  if (bottomContent) {
    return bottomContent;
  }
});

const findContent = (
  key: string | number | undefined,
  list: IMenuOptionExtend[]
): Component | undefined => {
  for (const item of list) {
    if (item.key === key) {
      return item.content;
    }
    if (item.children && item.children.length > 0) {
      const childrenContent = findContent(key, item.children);
      if (childrenContent) {
        return childrenContent;
      }
    }
  }
};

const handleMenuSelect = (key: string, item: IMenuOptionExtend) => {
  if (item.onSelect) {
    item.onSelect(key, item);
  } else {
    selectedKey.value = key;
  }
};
</script>

<style lang="less" scoped>
.menus-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.left-content {
  height: 100%;
  width: calc(100% - 64px);
  box-sizing: border-box;
  .left-pane-item-title-wrapper {
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px;
    padding: 0px 10px;
    box-sizing: border-box;
    border-color: v-bind("themeVars.borderColor");
  }
  .left-pane-item-title {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .left-pane-item-body {
    padding: 10px;
  }
}
</style>
