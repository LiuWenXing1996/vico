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
              <template v-if="appName">
                <div>{{ appName }}</div>
                <div>/</div>
                <template v-if="versionName">
                  <div>{{ versionName }}</div>
                </template>
                <template v-else>
                  <n-button
                    :focusable="false"
                    size="small"
                    @click="
                      () => {
                        setSideSelectedKey('versions');
                      }
                    "
                    >选择版本</n-button
                  >
                </template>
              </template>
              <template v-else>
                <n-button
                  :focusable="false"
                  size="small"
                  @click="
                    () => {
                      setSideSelectedKey('apps');
                    }
                  "
                  >选择应用</n-button
                >
              </template>
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
            <side-tabs
              :selected-key="studioState.sideSelectedKey"
              @update:selectedKey="
                (key) => {
                  setSideSelectedKey(key || '');
                }
              "
            >
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
                <div class="flex flex-col h-full">
                  <template v-if="studioState.panelList.length <= 0">
                    <div class="content">
                      <n-empty description="没有打开的面板"></n-empty>
                    </div>
                  </template>
                  <template v-else>
                    <n-tabs
                      size="small"
                      type="card"
                      :value="studioState.currentPanelKey"
                      @update:value="
                        (v) => {
                          setCurrentPanelKey(v);
                        }
                      "
                      closable
                      @close="
                        (key) => {
                          closePanel(key);
                        }
                      "
                      :style="{
                        height: '100%',
                        display: 'flex',
                        flexDirection: ' column',
                      }"
                      :pane-style="{
                        flexGrow: 1,
                        padding: 0,
                        overflow: 'hidden',
                      }"
                    >
                      <n-tab-pane
                        :name="l.key"
                        v-for="l in studioState.panelList"
                        display-directive="show"
                      >
                        <template #tab>
                          <div>{{ l.title }}</div>
                        </template>
                        <component :is="l.content()"></component>
                      </n-tab-pane>
                    </n-tabs>
                  </template>
                </div>
              </Pane>
            </Splitpanes>
          </Pane>
        </Splitpanes>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { first } from "radash";
import { Splitpanes, Pane } from "splitpanes";
const {
  studioState,
  setCurrentApp,
  setCurrentVersion,
  setSideSelectedKey,
  closePanel,
  setCurrentPanelKey,
} = useStudioState();
const route = useRoute();
const appName = computed(
  () => first(arraify(route.params.appName)) || undefined
);
const versionName = computed(
  () => first(arraify(route.params.versionName)) || undefined
);
const initApp = async () => {
  try {
    const app = await $fetch("/api/app/detail", {
      params: { name: appName.value },
    });
    setCurrentApp(app);
  } catch (error) {
    console.log({ error });
  }
};
const initVersion = async () => {
  try {
    const version = await $fetch("/api/version/detail", {
      params: { name: versionName.value, appName: appName.value },
    });
    setCurrentVersion(version);
  } catch (error) {
    setCurrentVersion();
  }
};
const init = async () => {
  await initApp();
  await initVersion();
};
await init();
</script>
