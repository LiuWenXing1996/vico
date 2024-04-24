import { useRequest } from "vue-request";
import type { SerializeObject } from "nitropack";
import { type GitServerUser } from "@/utils/git-server";

const store = ref<SerializeObject<NonNullable<GitServerUser>>>();

export const useCurrentUser = () => {
  const userRequest = useRequest(
    async () => {
      let user;
      try {
        user = await $fetch("/api/user/current");
      } catch (error) {}
      store.value = user as any;
    },
    { manual: true }
  );

  const refresh = async () => {
    await userRequest.refreshAsync();
  };

  const loggedIn = computed(() => {
    return Boolean(store.value);
  });
  const currentUser = computed(() => store.value);
  const login = async (params: { name: string; password: string }) => {
    return await $fetch("/api/user/login", {
      method: "POST",
      body: {
        name: params.name,
        password: params.password,
      },
    });
  };
  const logout = async () => {
    return await $fetch("/api/user/logout");
  };
  onMounted(() => {
    refresh();
  });
  return {
    loggedIn,
    login,
    logout,
    currentUser,
    refresh,
  };
};
