<template>
  <side-tab-pane name="files-manager" :position="SideTabPosition.top">
    <template #icon>
      <svg-icon name="files" />
    </template>
    <template #label> 文件管理器 </template>
    <template #title> 文件管理器 </template>
    <template #titleActions>
      <n-space :size="1">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="filesRequest.refresh"
            >
              <template #icon>
                <svg-icon name="refresh" :size="12" />
              </template>
            </n-button>
          </template>
          刷新
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              :focusable="false"
              size="tiny"
              quaternary
              @click="() => {}"
            >
              <template #icon>
                <svg-icon name="add" :size="12" />
              </template>
            </n-button>
          </template>
          添加
        </n-tooltip>
      </n-space>
    </template>
    <div class="h-full">
      <file-system-tree
        :vfs="studioState.vfs"
        :selected-keys="selectedKeys"
        @update:selectedKeys="
          (keys) => {
            console.log({ keys });
            selectedKeys = keys;
            tryOpenFileEditPanel(keys[0]);
          }
        "
      />
    </div>
  </side-tab-pane>
</template>
<script setup lang="ts">
import { FileEditor } from "#components";
import type { Params } from "~/server/api/app/files.get";
const { studioState, openPanel } = useStudioState();
const selectedKeys = ref<string[]>([]);
watch(
  () => studioState.value.currentPanelKey,
  (v) => {
    selectedKeys.value = v ? [v] : [];
  },
  { immediate: true }
);
const tryOpenFileEditPanel = async (filePath: string) => {
  const isDir = await studioState.value.vfs.isDirectory(filePath);
  if (isDir) {
    return;
  }
  const key = `file-edit-${filePath}`;
  openPanel({
    key,
    title: filePath,
    content: () =>
      h(FileEditor, { fileName: filePath, vfs: studioState.value.vfs }),
  });
};
const filesRequest = useCustomRequest(async () => {
  const appName = studioState.value.currentApp?.name;
  const versionName = studioState.value.currentVersion?.name;
  if (!appName) {
    return;
  }
  if (!versionName) {
    return;
  }
  const params: Params = {
    appName,
    versionName,
  };
  // @ts-ignore
  const res = await $fetch("/api/app/files", {
    params,
  });
  await Promise.all(
    res.map(async (e) => {
      await studioState.value.vfs.outputFile(e.path, e.content);
    })
  );
  return res;
});
</script>
