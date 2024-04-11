<template>
  <div class="tabs">
    <n-layout has-sider>
      <n-layout-sider bordered :width="64">
        <div class="menus-wrapper">
          <n-menu
            :options="topMenuOptions"
            :collapsed="true"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :value="selectedKey"
            @update:value="handleMenuSelect"
          />
          <n-menu
            :options="menuConifg.bottom"
            :collapsed="true"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :value="selectedKey"
            @update:value="handleMenuSelect"
            :dropdown-props="{
              size: 'small',
              placement: 'top-end',
            }"
          />
        </div>
      </n-layout-sider>
      <div class="left-content">
        <div v-for="item in items" class="left-pane-item-wrapper">
          <div class="left-pane-item-title">
            <template v-if="isString(item.title)">
              {{ item.title }}
            </template>
            <template v-else>
              <component :is="item.title"></component>
            </template>
          </div>

          <component :is="item.content"></component>
          <!-- {{ h(() => item.content) }} -->
        </div>
        <!-- <keep-alive>
          <component :is="selectedContent"></component>
        </keep-alive> -->
      </div>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import type { Component, VNodeChild } from "vue";
import type { MenuOption } from "naive-ui";
import {
  ApplicationList,
  DialogContentWrapper,
  GitServerList,
  NuxtIcon,
  RepoList,
  UserIcon,
  UserLogin,
} from "#components";
import { WorkspaceLeftPaneItemPosition } from "~/utils/workspace-left-pane";
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
// TODO:参照element-plus的tabs来实现container？
const topMenuOptions = computed<MenuOption[]>(() => {
  return items.value
    .filter((e) => e.position === WorkspaceLeftPaneItemPosition.top)
    .map((e) => {
      return {
        label: e.label,
        key: e.key,
        icon: e.icon,
      };
    });
});
const { loggedIn, logout } = useAuth();
const dialog = useDialog();

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
  padding: 10px;
  width: calc(100% - 64px);
  box-sizing: border-box;
}
</style>
