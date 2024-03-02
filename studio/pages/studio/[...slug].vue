<template>
    <div class="studio">
        <Workspace :project-name="projectName" :branch-name="branchName" />
    </div>
</template>

<script setup lang="ts">
import * as vico from "@vico/core";
console.log("vico-page", vico);

const route = useRoute()
const [] = route.params.slug
const slug = arraify(route.params.slug).map(e => {
    if (e) {
        return e
    }
    return undefined
})
const [projectName, branchName] = slug
definePageMeta({
    validate: (route) => {
        const slug = arraify(route.params.slug)
        if (slug.length > 2) {
            return false
        }
        return true
    }
})
</script>

<style lang="less" scoped>
.studio {
    height: 100vh;
    width: 100vw;
}
</style>