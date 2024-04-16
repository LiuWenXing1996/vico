<template>
  <split-pane v-bind="props">
    <slot></slot>
  </split-pane>
</template>
<script setup lang="ts">
import { Pane as SplitPane, type PaneProps } from "splitpanes";
const props = defineProps<Partial<PaneProps>>();
</script>
