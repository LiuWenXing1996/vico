<template>
    <n-form ref="formRef" label-placement="left" inline :label-width="80" :model="formValue" size="medium">
        <n-form-item label="名称" path="name">
            <n-input v-model:value="formValue.name" placeholder="输入名称" />
        </n-form-item>
        <n-form-item>
            <n-button attr-type="button" @click="handleSearchBtnClick">
                搜索
            </n-button>
        </n-form-item>
    </n-form>
</template>

<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, type FormInst } from "naive-ui"
import type { MaybePromise } from "~/types";

export interface ISearchValue {
    name?: string
}
const model = defineModel<ISearchValue>()
const props = defineProps<{
    handleSearch?: (value: ISearchValue) => MaybePromise<void>
    value?: ISearchValue,
}>()
const { handleSearch } = toRefs(props)

const formRef = ref<FormInst | null>(null)
const formValue = shallowRef<ISearchValue>({
    ...model.value
})
const searchBtnLoading = ref(false)

const handleSearchBtnClick = async (e: MouseEvent) => {
    e.preventDefault()
    model.value = formValue.value
    searchBtnLoading.value = true;
    try {
        await handleSearch.value?.(formValue.value)
    } catch (error) {
    }
    searchBtnLoading.value = false
}
</script>

<style lang="less" scoped></style>