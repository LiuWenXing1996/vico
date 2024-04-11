<template>
  <n-spin
    :delay="300"
    :show="
      gitServerListRequest.loading.value ||
      applicationCreateRequest.loading.value
    "
  >
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
              @click="applicationCreateRequest.runAsync"
              :loading="applicationCreateRequest.loading.value"
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
import { useRequest } from "vue-request";
import type { Params } from "~/server/api/application/create.post";
import type { MaybePromise } from "~/types";

const emits = defineEmits<{
  (e: "sucess"): MaybePromise<void>;
}>();
const message = useCustomMessage();
const formRef = ref<FormInst | null>(null);
const formValue = ref<Params>({
  name: "",
  description: "",
  gitServerId: 0,
});
const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
};
const gitServerListRequest = useRequest(
  async () => {
    return $fetch("/api/git-server/all");
  },
  {
    onError: (error) => message.anyError(error),
    manual: true,
    debounceInterval: 300,
  }
);
const applicationCreateRequest = useRequest(
  async () => {
    await formRef.value?.validate();
    const params: Params = {
      name: formValue.value.name || "",
      description: formValue.value.description,
      gitServerId: formValue.value.gitServerId,
    };
    const res = await $fetch("/api/application/create", {
      method: "post",
      body: {
        ...params,
      },
    });
    message.success("保存成功");
    emits("sucess");
    return res;
  },
  {
    onError: (error) => message.anyError(error),
    manual: true,
    debounceInterval: 300,
  }
);
onMounted(async () => {
  const gitserverList = await gitServerListRequest.runAsync();
  formValue.value.gitServerId = gitserverList[0].id || 0;
});
</script>
