<template>
  <n-collapse
    :expanded-names="expandedNames"
    @update:expanded-names="(e) => (expandedNames = e)"
    class="average-collapse"
  >
    <slot></slot>
  </n-collapse>
</template>
<script setup lang="ts">
const expandedNames = ref<string[]>([]);
const items = ref<AverageCollapseItem[]>([]);
const add = (item: AverageCollapseItem) => {
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
const remove = (name: string) => {
  const newItems = items.value.filter((e) => e.key !== name);
  items.value = [...newItems];
};
const activeItemHeight = computed(() => {
  const l = items.value.length || 0;
  const enl = expandedNames.value.length || 0;
  return `calc((100% - 35px * ${l}) / ${enl} + 35px)`;
});
createAverageCollapseProvide({
  add,
  remove,
});
</script>
<style lang="less" scoped>
.average-collapse {
  overflow: hidden;
  :deep(> .n-collapse-item--active) {
    height: v-bind(activeItemHeight);
  }
}
</style>
