import { createVfs, type IVirtulFileSystem } from "@vico/core";
import type { VNodeChild } from "vue";
import type { IBranch } from "~/server/models/branch";
import type { IProject } from "~/server/models/project";

export interface IWorkspaceBranch {
  name: string;
  description?: string;
}

export interface IWorkspaceStatePanelConfig {
  uid: string;
  title: string;
  content: () => VNodeChild;
}

export interface IWorkspaceState {
  vfs: IVirtulFileSystem;
  projectName?: string;
  projectInfo?: IProject;
  branchName?: string;
  branchInfo?: IBranch;
  currentPanelId?: string;
  panelList: IWorkspaceStatePanelConfig[];
}

export const useWorkspaceState = (params: {
  projectName: Ref<string | undefined>;
  branchName: Ref<string | undefined>;
}): IWorkspaceState => {
  const { branchName, projectName } = params;
  const vfs = createVfs();
  const state = reactive<IWorkspaceState>({
    vfs: markRaw(vfs),
    projectName: projectName.value,
    projectInfo: undefined,
    branchName: branchName.value,
    branchInfo: undefined,
    currentPanelId: undefined,
    panelList: [],
  });
  const stateRef = reactive(state) as IWorkspaceState;
  watch(
    [branchName, projectName],
    async ([branchName, projectName]) => {
      await state.vfs.rm("/");
      state.branchName = branchName;
      state.projectName = projectName;
    },
    {
      immediate: true,
    }
  );

  return stateRef;
};
