export interface WorkspaceProvide {
  currentRepo: ComputedRef<GitServerRepo | undefined>;
  currentBranch: ComputedRef<GitServerBranch | undefined>;
}

const key = Symbol() as InjectionKey<WorkspaceProvide>;

export const createWorkspaceProvide = (value: WorkspaceProvide) => {
  provide(key, value);
};

export const useWorkspaceProvide = () => {
  const value = inject(key);
  return value;
};
