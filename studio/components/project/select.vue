<template>
  <n-space>
    <n-card title="仓库">
      <project-list />
    </n-card>
    <n-card title="分支">
      <project-list />
    </n-card>
  </n-space>
</template>
<script setup lang="ts">
import { NCard, NSpace } from "naive-ui";
</script>
<style lang="less" scoped></style>
