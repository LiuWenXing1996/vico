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
import { NuxtIcon, ProjectList } from '#components'

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
        children: [{
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
        }]
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
