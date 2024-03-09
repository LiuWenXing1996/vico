<template>
    <NSpace vertical>
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging" :style="{
            maxWidth: '640px'
        }">
            <NFormItem label="名称" path="name">
                <NInput v-model:value="model.name" placeholder="请输入名称" />
            </NFormItem>
            <NFormItem label="模板" path="templateId">
                <NSelect v-model:value="model.templateId" filterable placeholder="搜索模板" :options="templateOptions"
                    :loading="templateListLoading" clearable remote @search="(value) => gitTemplateSearchKey = value" />
            </NFormItem>
            <NFormItem label="描述信息" path="description">
                <NInput v-model:value="model.description" type="textarea" />
            </NFormItem>
        </NForm>
        <NRow :gutter="[0, 24]">
            <NCol :span="24">
                <div style="display: flex; justify-content: flex-end">
                    <NButton round type="primary" @click="handleValidateButtonClick" :loading="submitLoading">
                        保存
                    </NButton>
                </div>
            </NCol>
        </NRow>
    </NSpace>
</template>

<script lang="ts" setup>
import { type SelectOption, type FormInst, NForm, NSelect, NDivider, NFormItem, NInput, useMessage, NSpace, NRow, NCol, NButton, type FormRules, type FormValidationError } from 'naive-ui'
import type { IProjectCreateParams } from '~/server/api/project/create.post';
import type { IGitlabTemplateListReturn } from "~/server/api/gitlab/template/list.get"
import type { MaybePromise } from '~/types';
const props = withDefaults(defineProps<{
    onSucess?: () => MaybePromise<void>
}>(), {
})
const { onSucess } = toRefs(props)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<Partial<IProjectCreateParams>>({
    name: '',
})
const submitLoading = ref<boolean>(false)
const gitTemplateSearchKey = ref<string | undefined>("vico")
const { data: templates, pending: templateListLoading } = useFetch<IGitlabTemplateListReturn>("/api/gitlab/template/list", {
    params: {
        name: gitTemplateSearchKey
    }
})
const templateOptions = computed<SelectOption[]>(() => {
    const tpls = templates.value || []
    return tpls.map(e => {
        return {
            value: e.id,
            label: e.name
        }
    })
})
const rules: FormRules = {
    name: [
        {
            required: true,
            message: "请输入名称",
        }
    ],
    templateId: [
        {
            required: true,
            message: "请选择仓库模板",
        }
    ],
}

const submit = async () => {
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
    const modelValue = toRaw(model.value)

    try {
        await $fetch("/api/project/create", {
            method: "post",
            body: {
                ...modelValue
            }
        })
    } catch (error: any) {
        if (error) {
            message.error(error?.data?.message || "创建失败");
            return
        }
    }

    message.success("保存成功");
    await onSucess.value?.()
}

const handleValidateButtonClick = async (e: MouseEvent) => {
    submitLoading.value = true
    e.preventDefault()
    await submit();
    submitLoading.value = false
}

</script>