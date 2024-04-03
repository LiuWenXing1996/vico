<template>
  <div class="repo-select">
    <n-card title="仓库">
      <div class="repo-list-wrapper">
        <repo-list />
      </div>
    </n-card>
    <n-card title="分支">
      <branch-list />
    </n-card>
  </div>
</template>
<script setup lang="ts">
import { NCard, NSpace, NGrid, NGi } from "naive-ui";
</script>
<style lang="less" scoped>
.repo-select {
  display: flex;
  height: 100%;
  padding: 0 10px;
  > .n-card {
    margin: 0 10px;
  }
  .repo-list-wrapper {
    height: 100%;
    overflow: hidden;
  }
}
</style>
