<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    style="height: 100%"
  >
    <div class="h-full flex flex-col">
      <div class="h-[50px] flex items-center border-b px-[10px]">
        {{ repoId }}
        {{ branchId }}
      </div>
      <div class="h-[calc(100%-50px)]">
        <Splitpanes>
          <Pane class="left-pane" min-size="15" size="20">
            <side-tabs>
              <side-tab-pane-files :repo-id="repoId" :branch-id="branchId" />
              <side-tab-pane
                name="search"
                label="搜索"
                title="搜索"
                :position="SideTabPosition.top"
              >
                <template #icon>
                  <svg-icon name="search" />
                </template>
                搜索
              </side-tab-pane>
              <side-tab-pane-versions :repoId="repoId" />
              <SideTabPaneUser />
            </side-tabs>
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
    </div>
  </n-config-provider>
</template>

<script setup lang="tsx">
import {
  ApplicationList,
  NSpace,
  NTooltip,
  SideTabPaneUser,
  SvgIcon,
  UserIcon,
  UserLogin,
  UserPaneTitleActions,
  UserSetting,
} from "#components";
import { createVfs } from "@vico/core";
import JSZip from "jszip";
import { NConfigProvider, zhCN, dateZhCN, NButton } from "naive-ui";
import { Splitpanes, Pane } from "splitpanes";
import type { Params as RepoDetailParams } from "~/server/api/repo/detail.get";
import type { Params as BranchDetailParams } from "~/server/api/branch/detail.get";
import "splitpanes/dist/splitpanes.css";

const props = defineProps<{
  repoId?: string;
  branchId?: string;
}>();
const { repoId, branchId } = toRefs(props);
const currentRepo = ref<GitServerRepo>();
const currentBranch = ref<GitServerRepo>();
createWorkspaceProvide({
  currentRepo: computed(() => currentRepo.value),
  currentBranch: computed(() => currentBranch.value),
});
const repoDetailRequest = useCustomRequest(async () => {
  currentRepo.value = undefined;
  currentBranch.value = undefined;
  if (!repoId.value) {
    return undefined;
  }
  const params: RepoDetailParams = {
    id: repoId.value,
  };
  const repo = await $fetch("/api/repo/detail", {
    params,
  });
  currentRepo.value = repo;
  return repo;
});
const branchDetailRequest = useCustomRequest(async () => {
  currentBranch.value = undefined;
  if (!branchId.value) {
    return undefined;
  }
  const params: BranchDetailParams = {
    id: branchId.value,
  };
  const repo = await $fetch("/api/branch/detail", {
    params,
  });
  currentBranch.value = repo;
  return repo;
});
watch(repoId, async () => {
  await repoDetailRequest.refreshAsync();
  await branchDetailRequest.refreshAsync();
});
watch(branchId, async () => {
  await branchDetailRequest.refreshAsync();
});
</script>
