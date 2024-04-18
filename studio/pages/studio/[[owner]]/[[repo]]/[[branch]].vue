<template>
  <div class="h-screen w-screen">
    <workspace :repo-id="repoId" :branch-id="branch" />
  </div>
</template>

<script setup lang="ts">
import { first } from "radash";
const route = useRoute();
const owner = computed(() => first(arraify(route.params.owner)) || undefined);
const repo = computed(() => first(arraify(route.params.repo)) || undefined);
const branch = computed(() => first(arraify(route.params.branch)) || undefined);
const repoId = computed(() => {
  if (!owner.value) {
    return;
  }
  if (!repo.value) {
    return;
  }
  return `${owner.value}/${repo.value}`;
});
</script>
