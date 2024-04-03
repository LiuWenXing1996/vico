<template>
  <div :style="style" class="dialog-content-wrapper">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import type { CSSProperties } from "vue";

const a = defineProps<{
  style: CSSProperties;
}>();
</script>
<style lang="less" scoped>
.dialog-content-wrapper {
}
</style>
