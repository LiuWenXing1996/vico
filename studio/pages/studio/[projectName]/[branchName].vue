<template>
    <div class="workspace-wrapper">
        <Workspace :projectName="projectName" :branchName="branchName" />
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const projectName = route.params.projectName
const branchName = route.params.branchName
if (!projectName || Array.isArray(projectName)) {
    throw createError("错误的路由参数")
}
if (!branchName || Array.isArray(branchName)) {
    throw createError("错误的路由参数")
}
</script>

<style lang="less" scoped>
.workspace-wrapper {
    height: 100vh;
    width: 100vw;
}
</style>