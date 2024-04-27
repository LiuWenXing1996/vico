<template>
  <div>
    <n-dropdown :options="options" @select="handleSelect">
      <n-button circle v-if="!loggedIn || !currentUser">
        <template #icon>
          <svg-icon name="user" />
        </template>
      </n-button>
      <div
        class="flex items-center justify-center text-[20px] w-[34px] h-[34px] rounded-full border border-slate-200 cursor-pointer"
        v-else="!loggedIn"
      >
        {{ currentUser?.name[0] }}
      </div>
    </n-dropdown>
    <DefineTemplate>
      <div class="px-[12px] py-[10px]" v-if="currentUser">
        {{ `${currentUser.name}(${currentUser.email})` }}
      </div>
    </DefineTemplate>
  </div>
</template>
<script setup lang="ts">
import { UserLogin } from "#components";
// 轻造
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
    showLoginDialog();
  }
};
const showLoginDialog = () => {
  dialog.create({
    showIcon: false,
    style: {
      width: "510px",
    },
    content: () => {
      return h(UserLogin);
    },
  });
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
