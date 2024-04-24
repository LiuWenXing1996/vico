<template>
  <div class="custom-thing">
    <n-thing>
      <n-descriptions
        :title="name"
        label-placement="left"
        label-align="left"
        :column="1"
      >
        <n-descriptions-item v-for="(value, key) in descriptions" :label="key">
          <div class="relative h-full w-full">
            <div
              class="absolute left-0 right-0 top-0 bottom-0 flex items-center"
            >
              <n-ellipsis>
                {{ value || "-" }}
              </n-ellipsis>
            </div>
          </div>
        </n-descriptions-item>
      </n-descriptions>
      <template #action v-if="actions?.length && actions?.length > 0">
        <n-space>
          <n-tooltip trigger="hover" v-for="item in actions">
            <template #trigger>
              <n-button :focusable="false" size="tiny" @click="item.onClick">
                <template #icon v-if="item.icon">
                  <svg-icon :name="item.icon" />
                </template>
              </n-button>
            </template>
            {{ item.title }}
          </n-tooltip>
        </n-space>
      </template>
    </n-thing>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  name?: string;
  descriptions?: Record<string, string | null | undefined>;
  actions?: {
    title: string;
    icon: string;
    onClick: () => void;
  }[];
}>();
</script>

<style lang="less" scoped>
.custom-thing {
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
}
</style>
