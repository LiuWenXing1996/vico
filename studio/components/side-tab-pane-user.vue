<template>
  <side-tab-pane name="user" :position="SideTabPosition.bottom">
    <template #icon>
      <svg-icon v-if="!loggedIn || !currentUser" name="user" />
      <img
        class="w-[22px] h-[22px] rounded-full border border-slate-200"
        v-else="!loggedIn"
        :src="currentUser.avatar_url"
      />
    </template>
    <template #label>
      {{ `${currentUser ? `当前用户(${currentUser.login})` : "未登录"}` }}
    </template>
    <template #title>
      {{ `${currentUser ? `当前用户(${currentUser.login})` : "未登录"}` }}
    </template>
    <template #titleActions>
      <n-space :size="1">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="refresh"
            >
              <template #icon>
                <svg-icon name="refresh" :size="12" />
              </template>
            </n-button>
          </template>
          刷新
        </n-tooltip>
        <n-tooltip trigger="hover" v-if="loggedIn">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="showLogoutDialog"
            >
              <template #icon>
                <svg-icon name="logout" :size="12" />
              </template>
            </n-button>
          </template>
          退出登录
        </n-tooltip>
        <n-tooltip trigger="hover" v-if="!loggedIn">
          <template #trigger>
            <n-button size="tiny" quaternary @click="loginWithGithub">
              <template #icon>
                <svg-icon name="login" :size="12" />
              </template>
            </n-button>
          </template>
          登录
        </n-tooltip>
      </n-space>
    </template>
    <repo-list />
  </side-tab-pane>
</template>
<script setup lang="ts">
const { loggedIn, user: currentUser, clear } = useUserSession();
const dialog = useDialog();
const gitServerListRequest = useCustomRequest(async () => {
  // @ts-ignore
  return await $fetch("/api/user/git-server/all");
});
const loginWithGithub = async () => {
  await navigateTo("/api/auth/github", { external: true });
};
const showLogoutDialog = () => {
  dialog.warning({
    title: "退出登录",
    content: "确定退出登录吗？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      await clear();
    },
    onNegativeClick: () => {},
  });
};
const refresh = () => {
  gitServerListRequest.refreshAsync();
};
const resetGitServerToken = async (gitServerId: number) => {
  const url = await $fetch("/api/git-server/oauth/gen-authorization-url", {
    params: { id: gitServerId },
  });
  window.open(url);
};
onMounted(() => {
  refresh();
});
</script>
