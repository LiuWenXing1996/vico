<template>
  <n-spin :delay="1000" :show="versionCreateRequest.loading.value">
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        :style="{
          maxWidth: '640px',
        }"
      >
        <n-form-item label="名称" path="name">
          <NInput v-model:value="formValue.name" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item label="描述信息" path="description">
          <NInput v-model:value="formValue.description" type="textarea" />
        </n-form-item>
      </n-form>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button
              round
              type="primary"
              @click="versionCreateRequest.runAsync"
              :loading="versionCreateRequest.loading.value"
            >
              保存
            </n-button>
          </div>
        </n-col>
      </n-row>
    </n-space>
  </n-spin>
</template>

<script lang="ts" setup>
import { type FormInst, type FormRules } from "naive-ui";
import type { Params } from "~/server/api/app/create.post";

const emits = defineEmits<{
  (e: "success"): void;
}>();
const message = useCustomMessage();
const formRef = ref<FormInst | null>(null);
const formValue = ref<Params>({
  name: "",
  description: "",
});
const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
};
const versionCreateRequest = useCustomRequest(async () => {
  const params: Params = {
    name: formValue.value.name || "",
    description: formValue.value.description,
  };
  const res = await $fetch("/api/app/create", {
    method: "post",
    body: {
      ...params,
    },
  });
  message.success("保存成功");
  emits("success");
  return res;
});
</script>
