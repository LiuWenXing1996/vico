<template>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN" style="height: 100%">
        <div class="cook-studio">
            <Splitpanes>
                <Pane class="left-pane" min-size="15" size="20">
                    <WorkspaceLeftPane></WorkspaceLeftPane>
                </Pane>
                <Pane class="center-bottom-pane" min-size="15" size="60">
                    <Splitpanes horizontal>
                        <Pane class="center-pane" min-size="15">
                            <WorkspaceCenterPane></WorkspaceCenterPane>
                        </Pane>
                    </Splitpanes>
                </Pane>
            </Splitpanes>
        </div>
    </n-config-provider>
</template>

<script setup lang="ts">
import { createVfs } from "@vico/core";
import JSZip from "jszip";
import { NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { provide, toRefs } from "vue";

const props = defineProps({
    projectName: {
        type: String,
    },
    branchName: {
        type: String,
    },
});
const { projectName, branchName } = toRefs(props);
const vfs = createVfs();
watch([projectName, branchName], async () => {
    if (projectName?.value && branchName?.value) {
        console.log("project/files")
        const { data } = await useFetch("/api/gitlab/project/files", {
            params: {
                projectId: projectName?.value,
                branchName: branchName?.value
            },
            responseType: "arrayBuffer",
            retry: false,
            watch: false,
            deep: false
        })
        const zip = new JSZip();
        const zipData = await zip.loadAsync(data.value as any);
        const zipFiles = zipData.files
        const files: {
            path: string;
            content: string;
        }[] = []
        console.log("zipFiles", zipFiles)
    }
}, { immediate: true })
</script>

<style lang="less">
.cook-studio {
    height: 100%;
    display: flex;

    .n-layout {
        height: 100%;
    }

    .splitpanes {
        .splitpanes__pane {
            background-color: transparent;
        }

        .splitpanes__splitter {
            background-color: rgb(239, 239, 245);
            position: relative;
        }

        .splitpanes__splitter:before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            transition: opacity 0.4s;
            background-color: rgba(24, 160, 88, 0.2);
            opacity: 0;
            z-index: 1;
        }

        .splitpanes__splitter:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 1;
        }

        .splitpanes__splitter:hover:before {
            opacity: 1;
        }

        &.splitpanes--vertical>.splitpanes__splitter {
            &::before {
                left: -3px;
                right: -3px;
                height: 100%;
            }

            &::after {
                border-left: 1px solid rgb(239, 239, 245);
                border-right: 1px solid rgb(239, 239, 245);
                width: 3px;
                height: 30px;
                transform: translateX(-50%);
            }
        }

        &.splitpanes--horizontal>.splitpanes__splitter {
            &::before {
                top: -3px;
                bottom: -3px;
                width: 100%;
            }

            &::after {
                border-top: 1px solid rgb(239, 239, 245);
                border-bottom: 1px solid rgb(239, 239, 245);
                width: 30px;
                height: 3px;
                transform: translateY(-50%);
            }
        }
    }
}
</style>
