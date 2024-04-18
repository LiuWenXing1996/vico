<template>
  <side-tab-pane name="files-manager" :position="SideTabPosition.top">
    <template #icon>
      <svg-icon name="files" />
    </template>
    <template #label> 文件管理器 </template>
    <template #title> 文件管理器 </template>
    <div class="h-full">
      <file-system-tree :vfs="currentVfs" />
    </div>
  </side-tab-pane>
</template>
<script setup lang="ts">
import { createVfs, type IVirtulFileSystem } from "@vico/core";
import JSZip from "jszip";
import type { Params } from "~/server/api/repo/files.get";

const props = defineProps<{
  repoId?: string;
  branchId?: string;
}>();
const currentVfs = shallowRef<IVirtulFileSystem>();
const { repoId, branchId } = toRefs(props);
const filesRequest = useCustomRequest(async () => {
  if (!repoId.value) {
    return;
  }
  if (!branchId.value) {
    return;
  }
  const params: Params = {
    repoId: repoId.value,
    branchId: branchId.value,
  };
  const res = await $fetch("/api/repo/files", {
    params,
    responseType: "arrayBuffer",
  });
  const zip = new JSZip();
  const zipData = await zip.loadAsync(res as any);
  const vfs = createVfs();
  await Promise.all(
    Object.keys(zipData.files).map(async (filePath) => {
      const zipFile = zipData.files[filePath];
      if (!zipFile.dir) {
        const content = await zipFile.async("base64");
        await vfs.outputFile(filePath, content);
      }
    })
  );
  currentVfs.value = vfs;
  return res;
});

watch(
  [repoId, branchId],
  () => {
    filesRequest.refreshAsync();
  },
  { immediate: true }
);
</script>
