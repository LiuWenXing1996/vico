<template>
  <div v-show="sideTabsProvide?.currentTabKey.value === name" class="h-full">
    <div v-if="canRender" class="h-full">
      <div class="left-pane-item-title-wrapper">
        <div class="left-pane-item-title">
          <template v-if="title">
            {{ title }}
          </template>
          <template v-else>
            <slot name="title"></slot>
          </template>
        </div>
        <div class="left-pane-item-title-actions">
          <slot name="titleActions"></slot>
        </div>
      </div>
      <div class="left-pane-item-body">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SideTabPosition } from "#imports";
const props = defineProps<{
  name: string;
  position: SideTabPosition;
  label?: string;
  title?: string;
}>();
const slots = defineSlots<{
  default(): any;
  label(): any;
  icon(): any;
  titleActions(): any;
  title(): any;
}>();
const { name, position, label } = toRefs(props);
const themeVars = useThemeVars();
const canRender = ref(false);
const sideTabsProvide = useSideTabsProvide();
onMounted(() => {
  sideTabsProvide?.addTab({
    position: position.value,
    key: name.value,
    label: label.value || slots.label,
    icon: slots.icon,
  });
});
watch(
  () => sideTabsProvide?.currentTabKey.value,
  (v) => {
    if (v !== name.value) {
      return;
    }
    if (!canRender.value) {
      canRender.value = true;
    }
  }
);
</script>
<style lang="less" scoped>
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
  height: calc(100% - 35px);
  overflow: auto;
}
</style>
