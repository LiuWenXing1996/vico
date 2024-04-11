<template>
  <n-layout has-sider>
    <n-layout-sider bordered :width="64">
      <div class="menus-wrapper">
        <n-menu :options="topMenuOptions" v-bind="commonMenuProps" />
        <n-menu :options="bottomMenuOptions" v-bind="commonMenuProps" />
      </div>
    </n-layout-sider>
    <div class="left-content">
      <slot></slot>
    </div>
  </n-layout>
</template>

<script setup lang="tsx">
import type { MenuOption, MenuProps } from "naive-ui";
import {
  SideTabPosition,
  sideTabToMenuOption,
} from "~/composables/useSideTabsProvide";
const tabs = ref<SideTab[]>([]);
const selectedKey = ref<string>();
const addTab = (item: SideTab) => {
  tabs.value = [...tabs.value, item];
};

const topMenuOptions = computed<MenuOption[]>(() => {
  return tabs.value
    .filter((e) => e.position === SideTabPosition.top)
    .map((e) => sideTabToMenuOption(e));
});
const bottomMenuOptions = computed<MenuOption[]>(() => {
  return tabs.value
    .filter((e) => e.position === SideTabPosition.bottom)
    .map((e) => sideTabToMenuOption(e));
});
const commonMenuProps = computed<MenuProps>(() => {
  return {
    collapsed: true,
    collapsedWidth: 64,
    collapsedIconSize: 22,
    value: selectedKey.value,
    onUpdateValue: (key: string) => (selectedKey.value = key),
  };
});
const { loggedIn, logout } = useAuth();
const dialog = useDialog();
const themeVars = useThemeVars();
createSideTabsProvide({
  currentTabKey: computed(() => selectedKey.value),
  addTab,
});
watch(tabs, () => {
  if (!selectedKey.value) {
    selectedKey.value = tabs.value[0].key;
  }
});
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
