<template>
  <side-tab-pane name="user" :position="SideTabPosition.bottom">
    <template #icon>
      <svg-icon name="user" />
    </template>
    <template #label>
      {{ `${currentUser ? `当前用户(${currentUser.name})` : "未登录"}` }}
    </template>
    <template #title>
      {{ `${currentUser ? `当前用户(${currentUser.name})` : "未登录"}` }}
    </template>
    <template #titleActions>
      <n-space :size="1">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="tiny" quaternary @click="refresh">
              <template #icon>
                <svg-icon name="refresh" :size="12" />
              </template>
            </n-button>
          </template>
          刷新
        </n-tooltip>
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
    <n-collapse>
      <n-collapse-item title="基础信息" name="base-info">
        <NForm
          ref="formRef"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <NFormItem label="名称" path="name">
            <NInput placeholder="请输入名称" />
          </NFormItem>
          <NFormItem label="githubToken">
            <NButton>重置githubToken</NButton>
          </NFormItem>
        </NForm>
        <NRow :gutter="[0, 24]">
          <NCol :span="24">
            <div style="display: flex; justify-content: flex-end">
              <NButton round type="primary"> 保存 </NButton>
            </div>
          </NCol>
        </NRow>
      </n-collapse-item>
      <n-collapse-item title="git服务配置" name="git-server-config">
        <n-spin :show="gitServerListRequest.loading.value">
          <n-list
            hoverable
            bordered
            v-if="
              gitServerListRequest.data.value &&
              gitServerListRequest.data.value.length > 0
            "
          >
            <n-list-item v-for="item in gitServerListRequest.data.value">
              <custom-thing
                :name="item.gitServer.name"
                :descriptions="{
                  描述: item.gitServer.description,
                  origin: item.gitServer.origin,
                  上次授权时间: item.config?.updatedAt,
                }"
                :actions="[
                  {
                    text: '重新授权',
                    onClick: () => {
                      resetGitServerToken(item.gitServer.id);
                    },
                  },
                ]"
              />
            </n-list-item>
          </n-list>
          <n-empty description="无数据" v-else />
        </n-spin>
      </n-collapse-item>
    </n-collapse>
  </side-tab-pane>
</template>
<script setup lang="ts">
import { UserLogin } from "#components";
const { loggedIn, logout, currentUser, refresh: refreshAuth } = useAuth();
const dialog = useDialog();
const gitServerListRequest = useCustomRequest(async () => {
  // @ts-ignore
  return await $fetch("/api/user/git-server/all");
});
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
const refresh = () => {
  gitServerListRequest.refreshAsync();
  refreshAuth();
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
