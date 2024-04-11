<template>
  <n-spin
    :delay="1000"
    :show="
      userBaseInfoEditRequest.loading.value || userDetailRequest.loading.value
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
      >
        <n-form-item label="名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入名称" />
        </n-form-item>
        <n-form-item label="名称" path="name">
          <n-input v-model:value="formValue.email" placeholder="请输入邮箱" />
        </n-form-item>
      </n-form>
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
    </n-space>
  </n-spin>
</template>

<script lang="ts" setup>
// TODO：实现个人设置界面，重要的可以设置gitlab token
import { UserGiteaTokenResetFrom } from "#components";
import {
  type FormInst,
  type FormRules,
  type FormValidationError,
} from "naive-ui";
import type { Params } from "~/server/api/user/update.post";
// TODO:实现用户基础信息修改？？？？
const { currentUser } = useAuth();
const userBaseInfoEditRequest = useCustomRequest(async () => {});
const userDetailRequest = useCustomRequest(async () => {});

const formRef = ref<FormInst | null>(null);
const message = useMessage();
const dialog = useDialog();
const formValue = ref<Partial<Params>>({
  name: "",
  email: "",
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
  const modelValue = toRaw(formValue.value);

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
