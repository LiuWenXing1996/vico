<template>
  <NMessageProvider>
    <NDialogProvider>
      <NuxtPage />
    </NDialogProvider>
  </NMessageProvider>
</template>
<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from "naive-ui"
</script>
<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
}
</style>
