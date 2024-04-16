<template>
  <div id="app">
    <naive-config>
      <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
        <n-message-provider>
          <n-dialog-provider>
            <nuxt-layout>
              <nuxt-page />
            </nuxt-layout>
          </n-dialog-provider>
        </n-message-provider>
      </n-config-provider>
    </naive-config>
  </div>
</template>

<script setup lang="ts">
import {
  NMessageProvider,
  NDialogProvider,
  NConfigProvider,
  zhCN,
  dateZhCN,
} from "naive-ui";
import "./style.global.less";
const { fetch } = useUserSession();
await fetch();
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
