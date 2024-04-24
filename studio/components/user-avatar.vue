<template>
  <div>
    <n-dropdown :options="options" @select="handleSelect">
      <n-button circle v-if="!loggedIn || !currentUser">
        <template #icon>
          <svg-icon name="user" />
        </template>
      </n-button>
      <img
        class="w-[34px] h-[34px] rounded-full border border-slate-200 cursor-pointer"
        v-else="!loggedIn"
        :src="currentUser.avatarUrl"
      />
    </n-dropdown>
    <DefineTemplate>
      <div class="px-[12px] py-[10px]" v-if="currentUser">
        {{ currentUser.name }}
      </div>
    </DefineTemplate>
  </div>
</template>
<script setup lang="ts">
// TODO:qingzao
// 轻造
// TODO:
const { loggedIn, currentUser, logout } = useCurrentUser();
const [DefineTemplate, ReuseTemplate] = createReusableTemplate();
const dialog = useDialog();
const options = computed(() => {
  return [
    {
      key: "user-info",
      type: "render",
      render: () => h(ReuseTemplate),
    },
    loggedIn.value
      ? {
          label: "退出登录",
          key: "logout",
          icon: renderSvgIcon("logout"),
        }
      : {
          label: "登录",
          key: "login",
          icon: renderSvgIcon("login"),
        },
  ];
});
const handleSelect = (key: string | number) => {
  if (key === "logout") {
    showLogoutDialog();
  }
  if (key === "login") {
    loginWithGithub();
  }
};
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
      await logout();
    },
    onNegativeClick: () => {},
  });
};
</script>
