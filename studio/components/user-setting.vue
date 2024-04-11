<template>
  <NSpace vertical>
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
    >
      <NFormItem label="名称" path="name">
        <NInput v-model:value="model.name" placeholder="请输入名称" />
      </NFormItem>
      <NFormItem label="githubToken">
        <NButton @click="resetGithubToken">重置githubToken</NButton>
      </NFormItem>
    </NForm>
    <NRow :gutter="[0, 24]">
      <NCol :span="24">
        <div style="display: flex; justify-content: flex-end">
          <NButton
            round
            type="primary"
            @click="handleValidateButtonClick"
            :loading="submitLoading"
          >
            保存
          </NButton>
        </div>
      </NCol>
    </NRow>
  </NSpace>
</template>

<script lang="ts" setup>
// TODO：实现个人设置界面，重要的可以设置gitlab token
import { UserGiteaTokenResetFrom } from "#components";
import {
  type FormInst,
  NForm,
  NFormItem,
  NInput,
  useMessage,
  NSpace,
  NRow,
  NCol,
  NButton,
  type FormRules,
  type FormValidationError,
  useDialog,
} from "naive-ui";
import type { Params } from "~/server/api/user/setting.post";

import type { MaybePromise } from "~/types";
const props = defineProps<{
  onSucess?: () => MaybePromise<void>;
}>();
const { onSucess } = toRefs(props);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const dialog = useDialog();
const model = ref<Partial<Params>>({
  name: "",
});
const submitLoading = ref<boolean>(false);

const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
};
// TODO:实现获取GitHub token
const resetGithubToken = async () => {
  // const url = await $typedFetch("/api/github/getAuthorizationUrl");
  // window.open(url)
};

const submit = async () => {
  try {
    (await formRef.value?.validate()) || {};
  } catch (error) {
    const errors = error as FormValidationError[];
    errors.map((es) => {
      es.map((e) => {
        if (e.message) {
          message.error(e.message);
        }
      });
    });
    return;
  }
  const modelValue = toRaw(model.value);

  try {
    await $fetch("/api/user/setting", {
      method: "post",
      body: {
        ...modelValue,
      },
    });
  } catch (error: any) {
    if (error) {
      message.error(error?.data?.message || "设置失败");
      return;
    }
  }

  message.success("保存成功");
  await onSucess.value?.();
};

const handleValidateButtonClick = async (e: MouseEvent) => {
  submitLoading.value = true;
  e.preventDefault();
  await submit();
  submitLoading.value = false;
};
const showGiteaTokenDialog = () => {
  const dialogIns = dialog.create({
    showIcon: false,
    title: "重置GiteaToken",
    content: () => {
      return h(UserGiteaTokenResetFrom, {
        onSucess: () => {
          dialogIns.destroy();
        },
      });
    },
  });
};
</script>
