<template>
  <div class="repo-list">
    <div class="actions-wrapper">
      <n-input
        :value="fetchParams.key"
        @update-value="
          (value) => {
            fetchParams.key = value;
          }
        "
      />
      <n-button type="primary" @click="handleCreateBtnClick">
        <template #icon>
          <svg-icon name="add" :size="22" />
        </template>
        添加仓库
      </n-button>
    </div>

    <div class="list-wrapper">
      <n-data-table
        :data="data?.items || []"
        :columns="clounms"
        :loading="pending"
        :style="{ height }"
        flex-height
        :pagination="paginationReactive"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { RepoCreate } from "#components";
import {
  NInput,
  NDataTable,
  type DataTableColumns,
  NSpace,
  NButton,
  useDialog,
} from "naive-ui";
import type { IReturn } from "~/server/api/repo/list.get";
type IRepo = IReturn["items"][0];
const dialog = useDialog();
withDefaults(
  defineProps<{
    // css height
    height?: string | number | undefined;
  }>(),
  {
    height: 400,
  }
);
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
const { data, refresh, pending } = await useFetch("/api/repo/list", {
  params: fetchParams,
  immediate: false,
});
onMounted(() => {
  refresh();
});
const clounms: DataTableColumns<IRepo> = [
  {
    title: "名称",
    key: "name",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "描述",
    key: "description",
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "操作",
    key: "actions",
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: "small",
                onClick: async () => {
                  // // TODO：先用这两参数试试
                  // await navigateTo(`/studio/${row.git.projectId}/main`, {
                  //   open: {
                  //     target: "_blank",
                  //   },
                  // });
                },
              },
              { default: () => "编辑" }
            ),
          ],
        }
      );
    },
  },
];
const paginationReactive = reactive({
  page: 2,
  pageSize: 10,
  onChange: (page: number) => {
    paginationReactive.page = page;
  },
});
const handleCreateBtnClick = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "创建仓库",
    content: () => {
      return h(RepoCreate, {
        onSucess: () => {
          dialogIns.destroy();
        },
      });
    },
  });
};
</script>
<style lang="less" scoped>
.repo-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .actions-wrapper {
    margin-bottom: 20px;
    display: flex;
    .n-button {
      margin-left: 20px;
    }
  }
  .list-wrapper {
    height: 100%;
    width: 100%;
  }
}
</style>
