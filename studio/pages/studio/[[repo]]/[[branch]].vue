<template>
  <div class="workspace-wrapper">
    <Workspace :repoName="repo" :branchName="branch" />
  </div>
</template>

<script setup lang="ts">
import { first } from "radash";
const route = useRoute();
// TODO:实现repoId和branchId的传入，传入是需要btoa下，防止ID有特殊字符
const repo = computed(() => first(arraify(route.params.repo)) || undefined);
const branch = computed(() => first(arraify(route.params.branch)) || undefined);
</script>

<style lang="less" scoped>
.workspace-wrapper {
  height: 100vh;
  width: 100vw;
}
</style>
