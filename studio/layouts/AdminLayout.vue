<template>
    <div class="admin-layout-wrapper">
        <n-layout>
            <n-layout-header bordered :native-scrollbar="false">
                header
            </n-layout-header>
            <n-layout has-sider>
                <n-layout-sider bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240"
                    :native-scrollbar="false">
                    <n-menu @select="handleMenuSelect" :collapsed-width="64" :collapsed-icon-size="22"
                        :options="menuOptions" :value="selectedKey" />
                </n-layout-sider>
                <NLayout>
                    <n-tabs :value="selectedKey" @update-value="(value) => { selectedKey = value; navigateTo(value) }"
                        type="card" closable tab-style="min-width: 80px;" @close="handleTabClose">
                        <NTab v-for="tab in tabList" :name="tab.key" :key="tab.key">{{ tab.name }}</NTab>
                    </n-tabs>
                    <NLayoutContent content-style="padding: 24px;">

                        <slot></slot>
                    </NLayoutContent>
                </NLayout>

            </n-layout>
        </n-layout>
    </div>
</template>

<script setup lang="ts">
import { NLayout, NLayoutSider, NMenu, NLayoutHeader, NLayoutContent, NTab, NSpace, type MenuOption, NTabs, useMessage } from 'naive-ui';
import type { RouteRecordNormalized } from '#vue-router';

const route = useRoute()
const router = useRouter()
const message = useMessage();
const routes = router.getRoutes().filter(e => e.path.startsWith("/admin"))
const tabList = ref<{
    name: string,
    key: string
}[]>([]);
const selectedKey = ref(route.path);

type IMenuOptionExtend = MenuOption & {
    key: string,
    onSelect?: (key: string, item: IMenuOptionExtend) => void,
    content?: Component,
    children?: IMenuOptionExtend[],
}
const handleTabClose = (name: string) => {
    const { value: tabListValue } = tabList
    if (tabListValue.length === 1) {
        message.warning('这已经是最后一页，不能再关闭了！');
        return
    }
    message.info('关掉 ' + name)
    const index = tabListValue.findIndex((v) => name === v.key)
    tabListValue.splice(index, 1)
    if (selectedKey.value === name) {
        selectedKey.value = tabListValue[index].key
    }
}

const routeToMenuOption = (route: RouteRecordNormalized): IMenuOptionExtend => {
    const menuOption: IMenuOptionExtend = {
        label: route.name,
        key: route.path,
        icon: route.meta.icon,
        onSelect: () => {
            selectedKey.value = route.path;
            if (!tabList.value.find(e => { e.key === route.path })) {
                tabList.value.push({ key: route.path, name: route.path })
            }
            navigateTo(route.path)
        }
    }
    return menuOption
}

const routesToMenuOptions = (routes: RouteRecordNormalized[]): IMenuOptionExtend[] => {
    return routes.sort((routeA, routeB) => {
        const aOrder = routeA.meta?.order || -Infinity;
        const bOrder = routeB.meta?.order || -Infinity;
        if (aOrder > bOrder) {
            return -1
        }
        if (aOrder < bOrder) {
            return 1
        }
        return 0
    }).map(route => routeToMenuOption(route))
}
const menuOptions = ref(routesToMenuOptions(routes || []))
const handleMenuSelect = (key: string, item: IMenuOptionExtend) => {
    if (item.onSelect) {
        item.onSelect(key, item)
    } else {
        selectedKey.value = key
    }
}
</script>

<style lang="less" scoped>
.admin-layout-wrapper {
    height: 100vh;

    >.n-layout {
        height: 100%;

        :deep(> .n-layout-scroll-container) {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>