<template>
    <div class="project-list">
        <NSpace vertical>
            <NSpace>
                <n-button @click="handleCreateBtnClick">新增</n-button>
            </NSpace>
            <NDataTable :data="data || []" :columns="clounms" :loading="listLoading"></NDataTable>
        </NSpace>
    </div>
</template>

<script setup lang="ts">
import { ProjectCreateForm } from "#components";
import { NDataTable, type DataTableColumns, NButton, NSpace, useDialog, useMessage } from "naive-ui"
import type { IProject } from "~/server/models/project";
const { data, refresh: refreshList, pending: listLoading } = await useFetch<IProject[]>("/api/project/list")
const dialog = useDialog()
const message = useMessage()
const clounms: DataTableColumns<IProject> = [
    {
        title: '名称',
        key: 'name'
    },
    {
        title: 'git仓库地址',
        key: 'git.url'
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
                            onClick: async () => {
                                // TODO：先用这两参数试试
                                await navigateTo(`/studio/${row.git.projectId}/main`)
                            }
                        },
                        { default: () => '打开' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            tertiary: true,
                            size: 'small',
                            onClick: () => {
                                const d = dialog.warning({
                                    title: '警告',
                                    content: '确定删除此项目？',
                                    positiveText: '确定',
                                    negativeText: '不确定',
                                    onPositiveClick: async () => {
                                        d.loading = true;
                                        const delSucess = await delProject(row.code)
                                        d.loading = false;
                                        if (delSucess) {
                                            refreshList()
                                        }
                                        return delSucess
                                    },
                                })
                            }
                        },
                        { default: () => '删除' }
                    )
                ]
            })
        }
    }
]

const delProject = async (code: string) => {
    try {
        await $fetch("/api/project/delete", {
            method: "post",
            body: {
                code
            }
        })
    } catch (error: any) {
        if (error) {
            message.error(error?.data?.message || "删除失败");
            return false
        }
    }
    message.success("删除成功");
    return true
}
const handleCreateBtnClick = () => {
    const dialogIns = dialog.create({
        showIcon: false,
        title: "项目列表",
        content: () => {
            return h(ProjectCreateForm, {
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