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
      <NFormItem label="token" path="giteaToken">
        <NInput
          v-model:value="model.giteaToken"
          placeholder="请输入giteaToken"
        />
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
import type { IParams } from "~/server/api/user/giteaTokenReset.post";

import type { MaybePromise } from "~/types";
const props = defineProps<{
  onSucess?: () => MaybePromise<void>;
}>();
const { onSucess } = toRefs(props);
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const model = ref<Partial<IParams>>({
  giteaToken: "",
});
const submitLoading = ref<boolean>(false);

const rules: FormRules = {
  giteaToken: [
    {
      required: true,
      message: "请输入giteaToken",
    },
  ],
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
  try {
    await $fetch("/api/user/giteaTokenReset", {
      method: "post",
      body: {
        ...model.value,
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
</script>
