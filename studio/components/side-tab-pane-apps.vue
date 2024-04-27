<template>
  <side-tab-pane name="apps" :position="SideTabPosition.top">
    <template #icon>
      <svg-icon name="app" />
    </template>
    <template #label> 应用管理 </template>
    <template #title> 应用管理 </template>
    <template #titleActions>
      <n-space :size="1">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="appListRequest.refresh"
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
            :show="appListRequest.loading.value || appDelRequest.loading.value"
            class="h-full"
            content-class="h-full"
          >
            <n-scrollbar
              trigger="none"
              v-if="
                appListRequest.data.value &&
                appListRequest.data.value.length > 0
              "
            >
              <n-list class="mx-[14px] mb-[14px]" hoverable bordered>
                <n-list-item v-for="item in appListRequest.data.value">
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
                          goToAppEdit(item);
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
import { AppCreate } from "#components";
type Item = NonNullable<(typeof appListRequest)["data"]["value"]>[0];
const dialog = useDialog();
const fetchParams = ref<{
  sort: string;
  key: string;
}>({
  sort: "",
  key: "",
});
const appListRequest = useCustomRequest(async () => {
  // @ts-ignore
  return await $fetch("/api/app/all", {
    params: fetchParams.value,
  });
});
const appDelRequest = useCustomRequest(async (params: { id: number }) => {
  return await $fetch("/api/app/delete", {
    method: "POST",
    body: { id: params.id },
  });
});
watch(
  () => fetchParams.value,
  () => {
    appListRequest.refresh();
  },
  {
    immediate: true,
  }
);
const showCreateDialog = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "创建应用",
    style: {
      width: "400px",
    },
    content: () => {
      return h(AppCreate, {
        onSuccess: () => {
          appListRequest.refresh();
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
      await appDelRequest.runAsync({ id: item.id });
      await appListRequest.refreshAsync();
    },
  });
};

const goToAppEdit = async (item: Item) => {
  const url = `/studio/${item.name}`;
  await navigateTo(url, { external: true });
};
</script>
