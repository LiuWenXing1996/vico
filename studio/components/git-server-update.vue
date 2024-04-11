<template>
  <n-spin
    :delay="300"
    :show="
      gitServerDetailRequest.loading.value ||
      gitServerUpdateRequest.loading.value
    "
  >
    <n-space vertical>
      <n-form
        ref="formRef"
        :model="formValue"
        label-placement="left"
        label-width="auto"
      >
        <n-form-item label="类型">
          <n-radio-group
            :value="gitServerDetailRequest.data.value?.type"
            :disabled="true"
          >
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
        <n-form-item label="oAuth 客户端 secret">
          <n-button>重置</n-button>
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
              @click="gitServerUpdateRequest.runAsync"
              :loading="gitServerUpdateRequest.loading.value"
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
import type { FormInst } from "naive-ui";
import type { Params } from "~/server/api/git-server/update.post";
import type { MaybePromise } from "~/types";
import { GitServerType } from "~/utils/git-server";
const props = defineProps<{
  id: number;
}>();
const emits = defineEmits<{
  (e: "sucess"): MaybePromise<void>;
}>();
const { id } = toRefs(props);
const formRef = ref<FormInst | null>(null);
const message = useCustomMessage();
const formValue = ref<Omit<Params, "id">>({
  name: "",
  description: "",
  origin: "",
  oAuthClientId: "",
});
const gitServerDetailRequest = useCustomRequest(async () => {
  return await $fetch("/api/git-server/detail", {
    params: { id: id.value },
  });
});
const gitServerUpdateRequest = useCustomRequest(async () => {
  await formRef.value?.validate();
  const params: Params = {
    id: id.value,
    name: formValue.value.name,
    description: formValue.value.description,
    origin: formValue.value.origin,
    oAuthClientId: formValue.value.oAuthClientId,
  };
  const res = await $fetch("/api/git-server/update", {
    method: "post",
    body: {
      ...params,
    },
  });
  message.success("保存成功");
  emits("sucess");
  return res;
});
onMounted(async () => {
  const res = await gitServerDetailRequest.refreshAsync();
  formValue.value = {
    name: res?.name || "",
    description: res?.description || "",
    origin: res?.origin || "",
    oAuthClientId: res?.oAuthClientId || "",
  };
});
</script>
