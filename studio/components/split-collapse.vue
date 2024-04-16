<template>
  <!-- <split-panes horizontal>
      <split-panes-item :min-size="20"> fsdfsd </split-panes-item>
      <div class="h-[30px]">fsdfds</div>
      <split-panes-item :min-size="20"> fsfsfsdfdfsd </split-panes-item>
      <split-panes-item :min-size="20"> fsfsfsdfdfsd </split-panes-item>
    </split-panes> -->
  <div class="h-full">
    <splitpanes horizontal v-if="items.length > 0">
      <!-- <pane :min-size="5" v-for="item in items" :key="item.key">
        <span>ddd</span>
      </pane> -->
      <template v-for="item in items">
  
          <pane :min-size="20"> ddd </pane>
        </template>
      <!-- <pane :min-size="20"> ddd </pane>
        <pane :min-size="20"> ddd </pane>
        <pane :min-size="20"> ddd </pane> -->
      <!-- <div class="h-[30px]">fsdfds</div>
        <pane>
          <span>1</span>
        </pane>
        <div class="h-[30px]">fsdfds</div>
        <pane :min-size="20">
          <span>2</span>
        </pane>
        <pane :min-size="20">
          <span>3</span>
        </pane> -->
    </splitpanes>
    <div class="hidden">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Splitpanes, Pane } from "splitpanes";
const items = ref<SplitCollapseItem[]>([]);
const count = ref(4);
setTimeout(() => {
  count.value = 8;
}, 1000);
const add = (item: SplitCollapseItem) => {
  const newItems = [...items.value];
  const index = items.value.findIndex((e) => e.key === item.key);
  if (index > -1) {
    newItems[index] = item;
  } else {
    newItems.push(item);
  }
  if (items.value.find((e) => e.key === item.key)) {
  }
  items.value = [...newItems];
};
createSplitCollapseProvide({
  add,
});
</script>
<style lang="less" scoped></style>
