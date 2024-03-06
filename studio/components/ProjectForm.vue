<template>
    <NSpace vertical>
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" :style="{
            maxWidth: '640px'
        }">
            <NFormItem label="名称" path="name">
                <n-input v-model:value="model.name" :disabled="Boolean(id)" />
            </NFormItem>
            <!-- <NFormItem label="仓库地址" path="url">
                <n-input v-model:value="model.url" :disabled="Boolean(id)" />
            </NFormItem> -->
            <NFormItem label="模板地址" path="templateUrl">
                <n-select v-model:value="value" filterable placeholder="搜索歌曲" :options="options" :loading="loading"
                    clearable remote @search="handleSearch" />
                <n-input v-model:value="model.url" :disabled="Boolean(id)" />
            </NFormItem>
            <NFormItem label="描述信息" path="description">
                <n-input v-model:value="model.description" type="textarea" />
            </NFormItem>
        </NForm>
        <NRow :gutter="[0, 24]">
            <NCol :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <NButton round type="primary" @click="handleValidateButtonClick">
                        保存
                    </NButton>
                </div>
            </NCol>
        </NRow>
    </NSpace>
</template>

<script lang="ts" setup>
import { type FormInst, NForm, NSelect, NFormItem, NInput, useMessage, NSpace, NRow, NCol, NButton, type FormRules, type FormValidationError } from 'naive-ui'
import type { IProject } from '~/server/models/project';
import type { MaybePromise } from '~/types';
const props = withDefaults(defineProps<{
    oldModel?: IProject,
    id?: string
    onSucess?: () => MaybePromise<void>
}>(), {
})
const { id, onSucess, oldModel } = toRefs(props)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<Partial<IProject>>(oldModel.value || {})
const rules: FormRules = {
    name: [
        {
            required: true,
            message: "请输入名称",
            trigger: ['input', 'blur']
        }
    ]
}

const handleValidateButtonClick = async (e: MouseEvent) => {
    e.preventDefault()
    try {
        await formRef.value?.validate() || {}
    } catch (error) {
        const errors = error as FormValidationError[]
        errors.map(es => {
            es.map(e => {
                if (e.message) {
                    message.error(e.message);
                }
            })
        })
        return
    }

    const { error } = await useFetch("/api/projectUpdate", {
        method: "post",
        body: {
            id: id.value,
            detail: model.value
        }
    })
    if (error.value) {
        message.error(error.value.message);
        return
    }
    message.success("保存成功");
    await onSucess.value?.()
}

</script>