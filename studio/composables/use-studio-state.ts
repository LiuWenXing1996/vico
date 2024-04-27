import { createVfs, type IVirtualFileSystem } from "@vico/core";
import { type InternalApi } from "nitropack";
import type { VNodeChild } from "vue";
type App = InternalApi["/api/app/detail"]["get"];
type AppVersion = InternalApi["/api/version/detail"]["get"];

export interface StudioPanel {
  key: string;
  title: string;
  content: () => VNodeChild;
}
export interface StudioState {
  currentApp?: App;
  currentVersion?: AppVersion;
  sideSelectedKey: string;
  vfs: IVirtualFileSystem;
  panelList: StudioPanel[];
  currentPanelKey?: string;
}

const store = shallowRef<StudioState>({
  sideSelectedKey: "",
  vfs: createVfs(),
  panelList: [],
});

export const useStudioState = () => {
  const studioState = computed(() => store.value);
  const setCurrentApp = (app?: App) => {
    store.value = {
      ...store.value,
      currentApp: app,
    };
  };
  const setCurrentVersion = (version?: AppVersion) => {
    store.value = {
      ...store.value,
      currentVersion: version,
    };
  };
  const setSideSelectedKey = (key: string) => {
    store.value = {
      ...store.value,
      sideSelectedKey: key,
    };
  };
  const closePanel = (key: string) => {
    const currentPanelKey = store.value.currentPanelKey;
    const panelList = store.value.panelList;
    if (currentPanelKey === key) {
      const lastPanel = panelList[panelList.length - 1];
      store.value = {
        ...store.value,
        currentPanelKey: lastPanel?.key,
      };
    }
    store.value = {
      ...store.value,
      panelList: panelList.filter((e) => e.key !== key),
    };
  };
  const openPanel = (panel: StudioPanel) => {
    const panelList = store.value.panelList;
    const panelFound = panelList.find((e) => e.key === panel.key);
    if (panelFound) {
      panelFound.content = panel.content;
      panel.title = panel.title;
    } else {
      store.value = {
        ...store.value,
        currentPanelKey: panel.key,
        panelList: [...panelList, panel],
      };
    }
  };
  const setCurrentPanelKey = (key: string) => {
    if (store.value.panelList.find((e) => e.key === key)) {
      store.value = {
        ...store.value,
        currentPanelKey: key,
      };
    }
  };
  return {
    studioState,
    setCurrentApp,
    setCurrentVersion,
    setSideSelectedKey,
    closePanel,
    openPanel,
    setCurrentPanelKey,
  };
};
