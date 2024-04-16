<template>
  <n-collapse-item :title="title" :name="name" class="average-collapse-pane">
    <slot></slot>
  </n-collapse-item>
</template>
<script setup lang="ts">
const props = defineProps<{
  name: string;
  title: string;
}>();
const { name, title } = toRefs(props);
const averageCollapseProvide = useAverageCollapseProvide();
watch(
  name,
  (newName, oldName) => {
    oldName && averageCollapseProvide?.remove(oldName);
    averageCollapseProvide?.add({
      key: name.value,
      title: title.value,
    });
  },
  { immediate: true }
);
onDeactivated(() => {
  averageCollapseProvide?.remove(name.value);
});
</script>
<style lang="less" scoped>
.average-collapse-pane {
  margin: 0;
  :deep(> .n-collapse-item__header) {
    height: 34px;
    display: flex;
    padding: 0;
  }
  :deep(> .n-collapse-item__content-wrapper) {
    height: calc(100% - 34px);
    > .n-collapse-item__content-inner {
      height: 100%;
      padding-top: 0px;
      overflow: auto;
    }
  }
}
</style>
