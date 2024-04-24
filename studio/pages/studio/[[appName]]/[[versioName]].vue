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
                :options="appListOptions"
              />
              <div>/</div>
              <n-select
                size="small"
                class="min-w-[100px]"
                :consistent-menu-width="false"
                v-model:value="versioName"
                :options="[]"
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
              <side-tab-pane-files />
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
import { Splitpanes, Pane } from "splitpanes";
const { loggedIn, user: currentUser, clear } = useUserSession();
const route = useRoute();
const appName = computed(
  () => first(arraify(route.params.appName)) || undefined
);
const versioName = computed(
  () => first(arraify(route.params.versioName)) || undefined
);
const appListRequest = useCustomRequest(async () => {
  return [];
});
const appListOptions = computed<SelectOption[]>(() => {
  return [];
});
</script>
