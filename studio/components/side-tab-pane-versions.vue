<template>
  <side-tab-pane name="versions" :position="SideTabPosition.top">
    <template #icon>
      <svg-icon name="versions" />
    </template>
    <template #label> 版本管理 </template>
    <template #title> 版本管理 </template>
    <template #titleActions>
      <n-space :size="1">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="versionListRequest.refresh"
            >
              <template #icon>
                <svg-icon name="refresh" :size="12" />
              </template>
            </n-button>
          </template>
          刷新
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="showCreateDialog"
            >
              <template #icon>
                <svg-icon name="add" :size="12" />
              </template>
            </n-button>
          </template>
          添加
        </n-tooltip>
      </n-space>
    </template>
    <div class="h-full flex flex-col">
      <div class="flex m-[14px]">
        <n-input
          clearable
          :value="fetchParams.key"
          @update-value="
            (value) => {
              fetchParams = {
                ...fetchParams,
                key: value,
              };
            }
          "
        />
      </div>
      <div class="relative h-full w-full">
        <div class="absolute left-0 right-0 top-0 bottom-0">
          <n-spin
            :show="
              versionListRequest.loading.value ||
              versionDelRequest.loading.value
            "
            class="h-full"
            content-class="h-full"
          >
            <n-scrollbar
              trigger="none"
              v-if="
                versionListRequest.data.value &&
                versionListRequest.data.value.length > 0
              "
            >
              <n-list class="mx-[14px] mb-[14px]" hoverable bordered>
                <n-list-item v-for="item in versionListRequest.data.value">
                  <custom-thing
                    :name="item.name"
                    :descriptions="{
                      描述: item.description,
                    }"
                    :actions="[
                      {
                        title: '开发',
                        icon: 'develop',
                        onClick: () => {
                          goToVersionEdit(item);
                        },
                      },
                      {
                        title: '编辑',
                        icon: 'edit',
                        onClick: () => {},
                      },
                      {
                        title: '删除',
                        icon: 'delete',
                        onClick: () => {
                          showDelDialog(item);
                        },
                      },
                    ]"
                  />
                </n-list-item>
              </n-list>
            </n-scrollbar>
            <div class="flex items-center h-full w-full justify-center" v-else>
              <n-empty description="无数据" />
            </div>
          </n-spin>
        </div>
      </div>
    </div>
  </side-tab-pane>
</template>
<script setup lang="ts">
import { VersionCreate } from "#components";
import type { Params as VersionAllParams } from "~/server/api/version/all.get";
const { studioState } = useStudioState();
type Item = NonNullable<(typeof versionListRequest)["data"]["value"]>[0];
const dialog = useDialog();
const fetchParams = ref<{
  sort: string;
  key: string;
}>({
  sort: "",
  key: "",
});
const versionListRequest = useCustomRequest(async () => {
  const appName = studioState.value.currentApp?.name;
  if (!appName) {
    return;
  }
  const params: VersionAllParams = {
    appName,
    ...fetchParams.value,
  };
  // @ts-ignore
  return await $fetch("/api/version/all", {
    params,
  });
});
const versionDelRequest = useCustomRequest(async (params: { id: number }) => {
  return await $fetch("/api/version/delete", {
    method: "POST",
    body: { id: params.id },
  });
});
watch(
  () => fetchParams.value,
  () => {
    versionListRequest.refresh();
  },
  {
    immediate: true,
  }
);
const showCreateDialog = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "创建版本",
    style: {
      width: "400px",
    },
    content: () => {
      return h(VersionCreate, {
        onSuccess: () => {
          versionListRequest.refresh();
          dialogIns.destroy();
        },
      });
    },
  });
};
const showDelDialog = (item: Item) => {
  const dialogIns = dialog.warning({
    title: "删除提示",
    content: `确定删除 ${item.name} 吗？`,
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      dialogIns.destroy();
      await versionDelRequest.runAsync({ id: item.id });
      await versionListRequest.refreshAsync();
    },
  });
};

const goToVersionEdit = async (item: Item) => {
  const appName = studioState.value.currentApp?.name;
  if (!appName) {
    return;
  }
  const url = `/studio/${appName}/${item.name}`;
  await navigateTo(url, { external: true });
};
</script>
