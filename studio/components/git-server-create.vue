<template>
  <n-spin :delay="300" :show="gitServerCreateRequest.loading.value">
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item
          label="类型"
          path="type"
          :rule="[
            {
              required: true,
              message: '请选择类型',
            },
          ]"
        >
          <n-radio-group v-model:value="formValue.type">
            <n-space>
              <n-radio v-for="g in GitServerType" :key="g" :value="g">
                {{ g }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item
          label="名称"
          path="name"
          :rule="[
            {
              required: true,
              message: '请输入名称',
            },
          ]"
        >
          <n-input v-model:value="formValue.name" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item
          label="origin"
          path="origin"
          :rule="[
            {
              required: true,
              message: '请输入 origin',
            },
          ]"
        >
          <n-input
            v-model:value="formValue.origin"
            placeholder="请输入 origin"
          />
        </n-form-item>
        <n-form-item
          label="oAuth 客户端 id"
          path="oAuthClientId"
          :rule="[
            {
              required: true,
              message: '请输入 oAuth 客户端 id',
            },
          ]"
        >
          <n-input
            v-model:value="formValue.oAuthClientId"
            placeholder="请输入 oAuth 客户端 id"
          />
        </n-form-item>
        <n-form-item
          label="oAuth 客户端 secret"
          path="oAuthClientSecret"
          :rule="[
            {
              required: true,
              message: '请输入 oAuth 客户端 secret',
            },
          ]"
        >
          <n-input
            v-model:value="formValue.oAuthClientSecret"
            placeholder="请输入 oAuth 客户端 secret"
          />
        </n-form-item>
        <n-form-item label="描述信息" path="description">
          <n-input v-model:value="formValue.description" type="textarea" />
        </n-form-item>
      </n-form>
      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div style="display: flex; justify-content: flex-end">
            <n-button
              round
              type="primary"
              @click="gitServerCreateRequest.runAsync"
              :loading="gitServerCreateRequest.loading.value"
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
import type { FormInst, FormRules } from "naive-ui";
import { useRequest } from "vue-request";
import type { Params } from "~/server/api/git-server/create.post";
import type { MaybePromise } from "~/types";
import { GitServerType } from "~/utils/git-server";

const emits = defineEmits<{
  (e: "sucess"): MaybePromise<void>;
}>();
const formRef = ref<FormInst | null>(null);
const message = useCustomMessage();
const formValue = ref<Params>({
  name: "",
  description: "",
  type: GitServerType.github,
  origin: "",
  oAuthClientId: "",
  oAuthClientSecret: "",
});
const gitServerCreateRequest = useRequest(
  async () => {
    await formRef.value?.validate();
    const params: Params = {
      name: formValue.value.name,
      description: formValue.value.description,
      type: formValue.value.type,
      origin: formValue.value.origin,
      oAuthClientId: formValue.value.oAuthClientId,
      oAuthClientSecret: formValue.value.oAuthClientSecret,
    };
    const res = await $fetch("/api/git-server/create", {
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
</script>
