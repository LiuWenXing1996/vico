<template>
  <n-space>
    <n-tooltip trigger="hover" v-if="loggedIn">
      <template #trigger>
        <n-button size="tiny" quaternary @click="showLogoutDialog">
          <template #icon>
            <svg-icon name="logout" :size="12" />
          </template>
        </n-button>
      </template>
      退出登录
    </n-tooltip>
    <n-tooltip trigger="hover" v-if="!loggedIn">
      <template #trigger>
        <n-button size="tiny" quaternary @click="showLoginDialog">
          <template #icon>
            <svg-icon name="login" :size="12" />
          </template>
        </n-button>
      </template>
      登录
    </n-tooltip>
  </n-space>
</template>
<script setup lang="ts">
import { UserLogin } from "#components";

const dialog = useDialog();
const { loggedIn, logout } = useAuth();
const showLogoutDialog = () => {
  dialog.warning({
    title: "退出登录",
    content: "确定退出登录吗？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      await logout();
    },
    onNegativeClick: () => {},
  });
};
const showLoginDialog = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    style: {
      width: "510px",
    },
    content: () => {
      return h(UserLogin, {
        onSucess: () => {
          dialogIns.destroy();
        },
      });
    },
  });
};
</script>
