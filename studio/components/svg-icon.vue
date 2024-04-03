<template>
  <span class="svg-icon">
    <n-icon :size="size" :color="color" :depth="depth">
      <nuxt-icon :name="name" />
    </n-icon>
  </span>
</template>
<script setup lang="ts">
import { NIcon, type IconProps } from "naive-ui";
defineProps<{
  name: string;
  color?: IconProps["color"];
  size?: IconProps["size"];
  depth?: IconProps["depth"];
}>();
</script>
<style lang="less" scoped>
.svg-icon {
  :deep(.nuxt-icon) {
    svg {
      margin-bottom: 0;
      vertical-align: top;
    }
  }
}
</style>
