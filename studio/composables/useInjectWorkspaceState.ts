import { createVfs, type IVirtulFileSystem } from "@vico/core";
import { useMessage } from "naive-ui";
import type { VNodeChild } from "vue";
import type { IBranch } from "~/server/models/branch";
import type { IProject } from "~/server/models/project";

export const WorkspaceStateInjectKey = "workspaceState";

export interface IWorkspaceState {
  vfs: IVirtulFileSystem;
  project: IProject;
  branch: IBranch;
  currentPanelId?: string;
  panelList: IWorkspaceStatePanelConfig[];
}

export interface IWorkspaceStatePanelConfig {
  uid: string;
  title: string;
  content: () => VNodeChild;
}

export const useInjectWorkspaceState = () => {
  const workspaceState = inject<Ref<IWorkspaceState | undefined>>(
    WorkspaceStateInjectKey
  );
  const update = (state: Partial<IWorkspaceState>) => {
    if (workspaceState && workspaceState.value) {
      const workspaceStateValue = {
        ...workspaceState.value,
        ...state,
      };
      workspaceState.value = {
        ...workspaceStateValue,
      };
    }
  };
  return {
    data: workspaceState,
    update,
  };
};

export const createWorkspaceState = async (params: {
  projectName: string;
  branchName: string;
}) => {
  const { branchName, projectName } = params;
  const vfs = createVfs();
  const message = useMessage();
  const projectFetchRes = await useFetch<IProject>("/api/project", {
    params: {
      name: projectName,
    },
  });
  if (projectFetchRes.error.value) {
    message.error(projectFetchRes.error.value.message);
  }
  const project = projectFetchRes.data.value;
  if (!project) {
    return;
  }
  const branchFecthRes = await useFetch<IProject>("/api/branch", {
    params: {
      name: branchName,
    },
  });
  if (branchFecthRes.error.value) {
    message.error(branchFecthRes.error.value.message);
  }
  const branch = branchFecthRes.data.value;
  if (!branch) {
    return;
  }
  const state: IWorkspaceState = {
    vfs,
    project,
    branch,
    currentPanelId: undefined,
    panelList: [],
  };

  return state;
};
