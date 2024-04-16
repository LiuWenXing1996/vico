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
          :show="branchListRequest.loading.value"
          class="h-full"
          content-class="h-full"
        >
          <n-scrollbar>
            <n-list
              hoverable
              bordered
              v-if="
                branchListRequest.data.value?.items &&
                branchListRequest.data.value?.items.length > 0
              "
            >
              <n-list-item v-for="item in branchListRequest.data.value.items">
                <custom-thing
                  :name="item.name"
                  :descriptions="{
                    描述: item.name,
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
import type { Params } from "~/server/api/branch/list.get";
const props = defineProps<{
  repoId?: string;
}>();
const { repoId } = toRefs(props);
const dialog = useDialog();
const fetchParams = ref<Partial<Params>>({
  key: "",
  page: 1,
  limit: 10,
  repoId: repoId.value,
});
const branchListRequest = useCustomRequest(async () => {
  const params = fetchParams.value;
  if (!params.repoId) {
    return;
  }
  const res = await $fetch("/api/branch/list", {
    params: fetchParams.value,
  });
  return res;
});
type Item = NonNullable<typeof branchListRequest.data.value>["items"][0];
const goRepoSettingPage = (item: Item) => {
  // window.open(`${item.html_url}/settings`);
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
          branchListRequest.refresh();
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
          branchListRequest.refresh();
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
    branchListRequest.refresh();
  }
);
onMounted(() => {
  branchListRequest.refresh();
});
</script>
