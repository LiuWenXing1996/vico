<template>

</template>
<script setup lang="ts">
import { Pane as SplitPane } from "splitpanes";
const props = defineProps<{
  name: string;
  title?: string;
}>();
const slots = defineSlots<{
  default(): any;
  titleActions(): any;
  title(): any;
}>();
const { name, title } = toRefs(props);
const splitCollapseProvide = useSplitCollapseProvide();
onMounted(() => {
  splitCollapseProvide?.add({
    key: name.value,
    title: title.value || slots.title,
    content: slots.default,
  });
});
</script>
