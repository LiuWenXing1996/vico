<template>
  <n-layout has-sider class="h-full">
    <n-layout-sider bordered :width="64">
      <div class="flex flex-col justify-between h-full">
        <n-menu :options="topMenuOptions" v-bind="commonMenuProps" />
        <n-menu :options="bottomMenuOptions" v-bind="commonMenuProps" />
      </div>
    </n-layout-sider>
    <div class="h-full w-[calc(100%-64px)]">
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
const props = defineProps<{
  selectedKey?: string;
}>();
const tabs = ref<SideTab[]>([]);
const emits = defineEmits<{
  (e: "update:selectedKey", key: string | undefined): void;
}>();
const { state: selectedKey, set: setSelectedKey } = useControlledState({
  key: "selectedKey",
  props,
  emit: (value) => {
    emits("update:selectedKey", value);
  },
});
const addTab = (item: SideTab) => {
  const newItems = [...tabs.value];
  const index = tabs.value.findIndex((e) => e.key === item.key);
  if (index > -1) {
    newItems[index] = item;
  } else {
    newItems.push(item);
  }
  if (tabs.value.find((e) => e.key === item.key)) {
  }
  tabs.value = [...newItems];
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
    onUpdateValue: (key: string) => setSelectedKey(key),
  };
});
createSideTabsProvide({
  currentTabKey: computed(() => selectedKey.value),
  addTab,
});
watch(tabs, () => {
  if (!selectedKey.value) {
    setSelectedKey(tabs.value[0].key);
  }
});
</script>
