<template>
  <div class="h-screen w-screen">
    <div class="h-full flex flex-col">
      <div class="h-[50px] flex justify-between items-center border-b">
        <div class="flex h-full items-center">
          <div
            class="w-[64px] h-full items-center justify-center flex border-r"
          >
            <svg-icon size="33" name="logo" />
          </div>
          <div class="ml-[10px]">
            <n-space :align="'center'">
              <n-select
                size="small"
                class="min-w-[80px]"
                :consistent-menu-width="false"
                v-model:value="appName"
                @update:value="
                  (v,option:any) => {
                    goToRepoEdit(option._richValue);
                  }
                "
                :options="repoListOptions"
              />
              <div>/</div>
              <n-select
                size="small"
                class="min-w-[100px]"
                :consistent-menu-width="false"
                v-model:value="versionName"
                @update:value="
                  (v,option:any) => {
                    goToBranchEdit(option._richValue);
                  }
                "
                :options="branchListOptions"
              />
            </n-space>
          </div>
        </div>

        <div class="pr-[10px]">
          <user-avatar />
        </div>
      </div>
      <div class="h-[calc(100%-50px)]">
        <Splitpanes>
          <Pane class="left-pane" min-size="15" size="20">
            <side-tabs>
              <side-tab-pane-files :repo-id="appName" :branch-id="versionName" />
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
              <side-tab-pane-versions />
              <side-tab-pane-apps />
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
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from "naive-ui";
import { first } from "radash";
import type { Params as RepoListParams } from "~/server/api/repo/list.get";
import type { Params as BranchListParams } from "~/server/api/branch/list.get";
import { Splitpanes, Pane } from "splitpanes";
const route = useRoute();
const appName = computed(
  () => first(arraify(route.params.appName)) || undefined
);
const versionName = computed(
  () => first(arraify(route.params.versionName)) || undefined
);
const repoListRequest = useCustomRequest(async () => {
  const params: RepoListParams = {
    page: 1,
    limit: 10,
  };
  return await $fetch("/api/repo/list", {
    params: params,
  });
});
const repoListOptions = computed<SelectOption[]>(() => {
  if (!repoListRequest.data.value?.items) {
    return [];
  }
  return repoListRequest.data.value.items.map((e) => {
    return {
      label: e.name,
      value: e.id,
      _richValue: e,
    };
  });
});
const branchListRequest = useCustomRequest(async () => {
  if (!appName.value) {
    return;
  }
  const params: BranchListParams = {
    page: 1,
    limit: 10,
    repoId: appName.value,
  };
  return await $fetch("/api/branch/list", {
    params: params,
  });
});
const branchListOptions = computed<SelectOption[]>(() => {
  if (!branchListRequest.data.value?.items) {
    return [];
  }
  return branchListRequest.data.value.items.map((e) => {
    return {
      label: e.name,
      value: e.id,
      _richValue: e,
    };
  });
});
const goToRepoEdit = async (repo: GitServerRepo) => {
  const url = `/studio/${repo.id}`;
  await navigateTo(url);
};
const goToBranchEdit = async (branch: GitServerBranch) => {
  const url = `/studio/${appName.value}/${branch.id}`;
  await navigateTo(url);
};
onMounted(() => {
  repoListRequest.runAsync();
  branchListRequest.runAsync();
});
</script>
