<template>
  <side-tab-pane name="versions" :position="SideTabPosition.top">
    <template #icon>
      <svg-icon name="versions" />
    </template>
    <template #label> 版本管理 </template>
    <template #title> 版本管理 </template>
    <div class="h-full">
      <average-collapse class="h-full overflow-auto">
        <average-collapse-pane title="分支列表" name="branch-list">
          <div class="h-full p-[10px]">
            <branch-list :repoId="repoId" />
          </div>
        </average-collapse-pane>
        <average-collapse-pane title="白银" name="2">
          <div>很好</div>
        </average-collapse-pane>
        <average-collapse-pane title="黄金" name="3">
          <div>真棒</div>
        </average-collapse-pane>
      </average-collapse>
    </div>
  </side-tab-pane>
</template>
<script setup lang="ts">
const props = defineProps<{
  repoId?: string;
}>();
</script>
