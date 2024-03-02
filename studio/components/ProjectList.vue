<template>
    <div class="project-list">
        <NSpace vertical>
            <NSpace>
                <n-button @click="handleCreateBtnClick">新增</n-button>
            </NSpace>
            <NDataTable :data="data || []" :columns="clounms"></NDataTable>
        </NSpace>
    </div>
</template>
<script setup lang="ts">
import { ProjectForm } from "#components";
import { NDataTable, type DataTableColumns, NButton, NSpace, useDialog } from "naive-ui"
import type { IProject } from "~/server/models/project";
const { data } = await useFetch<IProject[]>("/api/projectList")
const dialog = useDialog()
const clounms: DataTableColumns<IProject> = [
    {
        title: '名称',
        key: 'name'
    },
    {
        title: '操作',
        key: 'actions',
        render(row) {
            return h(NSpace, {}, {
                default: () => [
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            onClick: () => { }
                        },
                        { default: () => '编辑' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            onClick: () => { }
                        },
                        { default: () => '删除' }
                    )
                ]
            })
        }
    }
]
const handleCreateBtnClick = () => {
    const dialogIns = dialog.create({
        showIcon: false,
        title: "项目列表",
        content: () => {
            return h(ProjectForm, {
                onSucess: () => {
                    dialogIns.destroy()
                }
            })
        }
    })
}
</script>
<style lang="less" scoped>
.project-list {}
</style>