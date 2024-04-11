<template>
  <NSpace vertical>
    <NForm
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
      <NFormItem label="名称" path="name">
        <NInput v-model:value="formValue.name" placeholder="请输入名称" />
      </NFormItem>
      <NFormItem label="模板仓库" path="templatePath">
        <NSelect
          v-model:value="formValue.templatePath"
          filterable
          placeholder="搜索模板"
          :options="templateOptions"
          :loading="templatesRequest.loading.value"
          clearable
          remote
          @update:value="
            async (value, options: any) => {
              selectedTpl = options?._richValue;
              formValue.templateBranch = '';
              await nextTick();
              branchListReq.runAsync();
            }
          "
          @search="(value) => (gitTemplateSearchKey = value)"
        />
      </NFormItem>
      <NFormItem label="模板分支" path="templateBranch">
        <NSelect
          v-model:value="formValue.templateBranch"
          filterable
          placeholder="搜索分支"
          :options="branchOptions"
          :loading="branchListReq.loading.value"
          clearable
          remote
        />
      </NFormItem>
      <NFormItem label="描述信息" path="description">
        <NInput v-model:value="formValue.description" type="textarea" />
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
  type SelectOption,
  type FormInst,
  NForm,
  NSelect,
  NDivider,
  NFormItem,
  NInput,
  useMessage,
  NSpace,
  NRow,
  NCol,
  NButton,
  type FormRules,
  type FormValidationError,
} from "naive-ui";
import type { Params } from "~/server/api/repo/create.post";
import type { IGitlabTemplateListReturn } from "~/server/api/gitlab/template/list.get";
import type { GitHubRepo, MaybePromise } from "~/types";
import { useRequest } from "vue-request";

const emits = defineEmits<{
  (e: "sucess"): MaybePromise<void>;
}>();
const formRef = ref<FormInst | null>(null);
const message = useMessage();
const selectedTpl = ref<GitHubRepo>();
export type IFormValue = Omit<Params, "templateOwner" | "templateRepo"> & {
  templatePath: string;
  templateBranch: string;
};
const formValue = ref<IFormValue>({
  name: "",
  description: "",
  templatePath: "",
  templateBranch: "",
});

const submitLoading = ref<boolean>(false);
const gitTemplateSearchKey = ref<string | undefined>();
const templatesRequest = useRequest(
  async (key?: string) => {
    return $fetch("/api/repo/templates", {
      retry: false,
      params: {
        key: key,
        limit: 10,
        page: 1,
      },
    });
  },
  {
    debounceInterval: 300,
    manual: true,
  }
);
watch(gitTemplateSearchKey, (v) => {
  templatesRequest.runAsync(v);
});
onMounted(() => {
  templatesRequest.runAsync("liuwenxing1996/vico");
});
const templateOptions = computed<SelectOption[]>(() => {
  const tpls = templatesRequest.data.value?.items || [];
  return tpls.map((e) => {
    return {
      value: e.full_name,
      label: e.full_name,
      _richValue: e,
    };
  });
});
const branchListReq = useRequest(
  async () => {
    if (!selectedTpl.value) {
      branchListReq.mutate(undefined);
      return;
    }
    return await $fetch("/api/branch/list", {
      params: {
        owner: selectedTpl.value?.owner?.login,
        repo: selectedTpl.value?.name,
        // key: gitTemplateSearchKey,
        limit: 10,
        page: 1,
      },
    });
  },
  {
    manual: true,
  }
);
const branchOptions = computed<SelectOption[]>(() => {
  const tpls = branchListReq.data.value?.items || [];
  return tpls.map((e) => {
    return {
      value: e.name,
      label: e.name,
      _richValue: e,
    };
  });
});
const rules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
  templateId: [
    {
      required: true,
      message: "请选择仓库模板",
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
  const params: Params = {
    name: formValue.value.name,
    description: formValue.value.description,
    templateOwner: selectedTpl.value?.owner?.login || "",
    templateRepo: selectedTpl.value?.name || "",
    templateBranch: formValue.value.templateBranch,
  };

  try {
    await $fetch("/api/repo/create", {
      method: "post",
      body: {
        ...params,
      },
    });
  } catch (error: any) {
    if (error) {
      message.error(error?.data?.message || "创建失败");
      return;
    }
  }

  message.success("保存成功");
  emits("sucess");
};

const handleValidateButtonClick = async (e: MouseEvent) => {
  submitLoading.value = true;
  e.preventDefault();
  await submit();
  submitLoading.value = false;
};
</script>
