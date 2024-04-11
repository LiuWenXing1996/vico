<template>
  <div class="application-list">
    <div class="actions-wrapper">
      <n-input
        clearable
        :value="serachKey"
        @update-value="
          (value) => {
            serachKey = value;
          }
        "
      />
      <n-popselect
        multiple
        :options="
          (gitServerListRequest.data.value || []).map((e) => {
            return {
              label: e.name,
              value: e.id,
            };
          })
        "
      >
        <n-button> git服务器 </n-button>
      </n-popselect>
      <n-button type="primary" @click="showCreateDialog">
        <template #icon>
          <svg-icon name="add" :size="22" />
        </template>
      </n-button>
    </div>

    <div class="list-wrapper">
      <n-spin :show="applicationListRequest.loading.value">
        <n-list
          hoverable
          bordered
          v-if="
            applicationListRequest.data.value &&
            applicationListRequest.data.value.length > 0
          "
        >
          <n-list-item v-for="item in applicationListRequest.data.value">
            <n-thing>
              <n-descriptions
                :title="item.name"
                label-placement="left"
                label-align="left"
                :column="1"
              >
                <n-descriptions-item label="描述">
                  <div class="auto-fit-width-wrapper">
                    <div class="auto-fit-width-content">
                      <n-ellipsis>
                        {{ item.description || "-" }}
                      </n-ellipsis>
                    </div>
                  </div>
                </n-descriptions-item>
                <n-descriptions-item label="gitServerId">
                  <div class="auto-fit-width-wrapper">
                    <div class="auto-fit-width-content">
                      <n-ellipsis>
                        {{ item.gitServerId }}
                      </n-ellipsis>
                    </div>
                  </div>
                </n-descriptions-item>
              </n-descriptions>
              <template #action>
                <n-space>
                  <n-button size="small" @click="showEditDilog(item)">
                    编辑
                  </n-button>
                  <n-button size="small" @click="showDelDialog(item)">
                    删除
                  </n-button>
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-empty description="无数据" v-else />
      </n-spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ApplicationCreate, ApplicationUpdate } from "#components";
import type { Application } from "@prisma/client";
import type { SerializeObject } from "nitropack";
const dialog = useDialog();
const serachKey = ref<string>();
// TODO：实现按照GIT服务器查找。。。
const applicationListRequest = useCustomRequest(async () => {
  const params = {
    key: serachKey.value,
  };
  return await $fetch("/api/application/all", { params });
});

const applicationDeleteRequest = useCustomRequest(
  async (params: { id: number }) => {
    return await $fetch("/api/application/delete", {
      method: "post",
      body: { id: params.id },
    });
  }
);
const gitServerListRequest = useCustomRequest(async () => {
  return $fetch("/api/git-server/all");
});
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
          applicationListRequest.refresh();
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
          applicationListRequest.refresh();
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
      await applicationDeleteRequest.runAsync({ id: row.id });
    },
    onNegativeClick: () => {},
  });
};
watch(serachKey, () => {
  applicationListRequest.refresh();
  gitServerListRequest.refresh();
});
onMounted(() => {
  applicationListRequest.refresh();
});
</script>
<style lang="less" scoped>
.application-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .actions-wrapper {
    margin-bottom: 10px;
    display: flex;
    .n-button {
      margin-left: 10px;
    }
  }
  .list-wrapper {
    height: 100%;
    width: 100%;
    :deep(.n-descriptions-table-content) {
      display: flex !important;
      .n-descriptions-table-content__content {
        flex: 1;
        display: flex !important;
        .n-ellipsis {
          vertical-align: middle;
        }
      }
      .n-descriptions-table-content__label {
        font-weight: bold;
      }
    }
    .auto-fit-width-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .auto-fit-width-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      display: flex;
      bottom: 0;
      align-items: center;
    }
  }
}
</style>
