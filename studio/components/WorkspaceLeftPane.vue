<template>
    <NLayout has-sider>
        <NLayoutSider bordered :width="64">
            <div class="menus-wrapper">
                <NMenu :options="menuOptions" :collapsed="true" :collapsed-width="64" :collapsed-icon-size="22"
                    :value="selectedKey" @select="handleMenuSelect" />
                <NMenu :options="bottomMenuOptions" :collapsed="true" :collapsed-width="64" :collapsed-icon-size="22"
                    :value="selectedKey" @select="handleMenuSelect" :dropdown-props="{
            size: 'small',
            placement: 'top-end'
        }" />
            </div>
        </NLayoutSider>
        <NMenu>
            <div class=" left-content">
                <KeepAlive>
                    <component :is="SelectedContent"></component>
                </KeepAlive>
            </div>
        </NMenu>
    </NLayout>
</template>

<script setup lang="ts">
import { toRefs, provide, ref, h, computed } from 'vue';
import type { Component } from "vue"
import { NLayout, NLayoutSider, NMenu, NIcon, useDialog } from "naive-ui"
import type { MenuOption } from "naive-ui"
import {
    DocumentsOutline,
    SearchOutline,
    PlayOutline,
    GridOutline
} from '@vicons/ionicons5'
import { NuxtIcon, ProjectList, UserSetting } from '#components'

const dialog = useDialog()
const selectedKey = ref('resource-manager')
const SelectedContent = computed(() => {
    const content = menuOptions.find(e => e.key === selectedKey.value)?.content
    return content
})

const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

type IMenuOptionExtend = MenuOption & {
    onSelect?: (key: string, item: IMenuOptionExtend) => void,
    content?: Component,
    children?: IMenuOptionExtend[]
}

const bottomMenuOptions: IMenuOptionExtend[] = [
    {
        label: '用户',
        key: 'user',
        icon: renderIcon(h(NuxtIcon, { name: "user" })),
        children: [
            {
                label: '项目列表',
                key: 'project',
                icon: renderIcon(h(NuxtIcon, { name: "project" })),
                onSelect: () => {
                    dialog.create({
                        showIcon: false,
                        style: {
                            width: "80vw"
                        },
                        title: "项目列表",
                        content: () => {
                            return h(ProjectList)
                        }
                    })
                },
            },
            {
                label: '个人设置',
                key: 'userSetting',
                icon: renderIcon(h(NuxtIcon, { name: "project" })),
                onSelect: () => {
                    dialog.create({
                        showIcon: false,
                        style: {
                           maxWidth:"200vw"
                        },
                        title: "个人设置",
                        content: () => {
                            return h(UserSetting)
                        }
                    })
                },
            },
            {
                label: '退出登录',
                key: 'logout',
                icon: renderIcon(h(NuxtIcon, { name: "project" })),
                onSelect: () => {
                    dialog.warning({
                        title: '退出登录',
                        content: '确定退出登录吗？',
                        positiveText: '确定',
                        negativeText: '不确定',
                        onPositiveClick: async () => {
                            await $fetch("/api/auth/logout");
                            await navigateTo(`/studio`, {
                                open: {
                                    target: "_self"
                                }
                            })
                        },
                        onNegativeClick: () => {
                        }
                    })

                },
            }
        ]
    },
]

const handleMenuSelect = (key: string, item: IMenuOptionExtend) => {
    if (item.onSelect) {
        item.onSelect(key, item)
    } else {
        selectedKey.value = key
    }
}


const menuOptions: (MenuOption & {
    content: Component
})[] = [
        {
            label: '搜索',
            key: 'search',
            icon: renderIcon(SearchOutline),
            content: () => h('div', "搜索")
        },

    ]
</script>

<style lang="less" scoped>
.menus-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.left-content {
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
}
</style>
