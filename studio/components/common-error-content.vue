<template>
  <span ></span>
  <div></div>
</template>
<script setup lang="ts">
import type { FormValidationError } from "naive-ui";

const porps = defineProps<{
  error: FormValidationError | FormValidationError[0];
}>();
const { error } = toRefs(porps);
</script>
<style lang="less" scoped></style>
