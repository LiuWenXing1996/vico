<template>
  <div class="h-full flex flex-col">
    <div class="flex mb-[10px]">
      <n-input
        clearable
        :value="fetchParams.key"
        @update-value="
          (value) => {
            fetchParams = {
              ...fetchParams,
              key: value,
              page: 1,
            };
          }
        "
      />
      <n-button type="primary" @click="showCreateDialog" class="ml-[10px]">
        <template #icon>
          <svg-icon name="add" :size="22" />
        </template>
      </n-button>
    </div>
    <div class="relative h-full w-full">
      <div class="absolute left-0 right-0 top-0 bottom-0">
        <n-spin
          :show="repoListRequest.loading.value"
          class="h-full"
          content-class="h-full"
        >
          <n-scrollbar>
            <n-list
              hoverable
              v-if="
                repoListRequest.data.value?.items &&
                repoListRequest.data.value?.items.length > 0
              "
            >
              <n-list-item v-for="item in repoListRequest.data.value.items">
                <custom-thing
                  :name="item.name"
                  :descriptions="{
                    描述: item.description,
                  }"
                  :actions="[
                    {
                      icon: 'setting',
                      onClick: () => {
                        goRepoSettingPage(item);
                      },
                    },
                    {
                      icon: 'branch',
                      onClick: () => {
                        goRepoSettingPage(item);
                      },
                    },
                  ]"
                />
              </n-list-item>
            </n-list>

            <n-empty description="无数据" v-else />
          </n-scrollbar>
        </n-spin>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ApplicationCreate, ApplicationUpdate } from "#components";
import type { Application } from "@prisma/client";
import type { SerializeObject } from "nitropack";
const dialog = useDialog();
const fetchParams = ref<{
  sort: string;
  key: string;
  page: number;
  limit: number;
}>({
  sort: "",
  key: "",
  page: 1,
  limit: 10,
});
const repoListRequest = useCustomRequest(async () => {
  return await $fetch("/api/repo/list", {
    params: fetchParams.value,
  });
});
type Item = NonNullable<typeof repoListRequest.data.value>["items"][0];
const goRepoSettingPage = (item: Item) => {
  window.open(`${item.html_url}/settings`);
};
const showCreateDialog = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "创建应用",
    style: {
      width: "400px",
    },
    content: () => {
      return h(ApplicationCreate, {
        onSucess: () => {
          repoListRequest.refresh();
          dialogIns.destroy();
        },
      });
    },
  });
};
const showEditDilog = (row: SerializeObject<Application>) => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "编辑应用",
    style: {
      width: "400px",
    },
    content: () => {
      return h(ApplicationUpdate, {
        id: row.id,
        onSucess: () => {
          repoListRequest.refresh();
          dialogIns.destroy();
        },
      });
    },
  });
};
const showDelDialog = (row: SerializeObject<Application>) => {
  dialog.warning({
    title: "删除",
    content: "确定删除吗？",
    positiveText: "确定",
    negativeText: "不确定",
    onPositiveClick: async () => {
      //   await applicationDeleteRequest.runAsync({ id: row.id });
    },
    onNegativeClick: () => {},
  });
};
watch(
  () => fetchParams.value,
  () => {
    repoListRequest.refresh();
  }
);
onMounted(() => {
  repoListRequest.refresh();
});
</script>
