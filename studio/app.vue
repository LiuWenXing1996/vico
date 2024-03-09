<template>
  <div id="app">
    <NMessageProvider>
      <NDialogProvider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </NDialogProvider>
    </NMessageProvider>
  </div>
</template>

<script setup lang="ts">
import { NMessageProvider, NDialogProvider } from "naive-ui"
</script>

<style lang="less" scoped>
body,
html {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
