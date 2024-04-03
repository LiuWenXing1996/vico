<template>
  <div class="workspace-wrapper">
    <Workspace :repo="repo" :branch="branch" />
  </div>
</template>

<script setup lang="ts">
import { first } from "radash";
const route = useRoute();
const action = computed(() => first(arraify(route.params.action)) || undefined);
const repo = computed(() => first(arraify(route.params.repo)) || undefined);
const branch = computed(() => first(arraify(route.params.branch)) || undefined);
watch(action, () => {});
</script>

<style lang="less" scoped>
.workspace-wrapper {
  height: 100vh;
  width: 100vw;
}
</style>
