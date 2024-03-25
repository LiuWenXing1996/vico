<template>
  <div class="project-list">
    <NSpace vertical>
      <NSpace>
        <ProjectListSerach
          v-model="searchValue"
          :handleSearch="handleSearch"
        ></ProjectListSerach>
        <n-button @click="handleCreateBtnClick">新增</n-button>
      </NSpace>
      <NDataTable
        :data="data || []"
        :columns="clounms"
        :loading="listLoading"
      ></NDataTable>
    </NSpace>
  </div>
</template>

<script setup lang="ts">
import { ProjectCreateForm } from "#components";
import {
  NDataTable,
  type DataTableColumns,
  NButton,
  NSpace,
  useDialog,
  useMessage,
  NForm,
  NFormItem,
  NInput,
  type FormInst,
} from "naive-ui";
import type { ISearchValue } from "./list/serach.vue";
import type { IReturn } from "~/server/api/project/list.get";
type IProject = NonNullable<IReturn>[0];

const searchValue = ref<ISearchValue>({ name: "" });

const {
  data,
  refresh: refreshList,
  pending: listLoading,
} = await useTypedFetch("/api/project/list", {
  params: {
    key: searchValue.value.name,
    page: 1,
    limit: 10,
  },
  immediate: false,
});
const handleSearch = () => {
  refreshList();
};
onMounted(() => {
  refreshList();
});
const dialog = useDialog();
const message = useMessage();
const clounms: DataTableColumns<IProject> = [
  {
    title: "名称",
    key: "name",
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
                onClick: () => {},
              },
              { default: () => "编辑" }
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: "small",
                onClick: async () => {
                  // TODO：先用这两参数试试
                  await navigateTo(`/studio/${row.git.projectId}/main`, {
                    open: {
                      target: "_blank",
                    },
                  });
                },
              },
              { default: () => "打开" }
            ),
            h(
              NButton,
              {
                strong: true,
                tertiary: true,
                size: "small",
                onClick: () => {
                  const d = dialog.warning({
                    title: "警告",
                    content: "确定删除此项目？",
                    positiveText: "确定",
                    negativeText: "不确定",
                    onPositiveClick: async () => {
                      d.loading = true;
                      const delSucess = await delProject(
                        row.owner?.login,
                        row.name
                      );
                      d.loading = false;
                      if (delSucess) {
                        refreshList();
                      }
                      return delSucess;
                    },
                  });
                },
              },
              { default: () => "删除" }
            ),
          ],
        }
      );
    },
  },
];

const delProject = async (owner: string, repo: string) => {
  try {
    const res = await useCustomFetch("/api/project/delete", {
      method: "post",
      body: {
        owner,
        repo,
      },
      watch: false,
    });
    if (!res.data.value) {
      throw new Error();
    }
  } catch (error: any) {
    if (error) {
      message.error(error?.data?.message || "删除失败");
      return false;
    }
  }
  message.success("删除成功");
  return true;
};
const handleCreateBtnClick = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "项目列表",
    content: () => {
      return h(ProjectCreateForm, {
        onSucess: () => {
          dialogIns.destroy();
        },
      });
    },
  });
};
</script>

<style lang="less" scoped>
.project-list {
}
</style>
