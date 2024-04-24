import { useRequest } from "vue-request";
import type { Return } from "~/server/api/user/current.get";
import type { SerializeObject } from "nitropack";

const authStore = ref<SerializeObject<NonNullable<Return>>>();

export const useAuth = () => {
  const userRequest = useRequest(
    async () => {
      let user;
      try {
        user = await $fetch("/api/user/current");
      } catch (error) {}
      authStore.value = user as any;
    },
    { manual: true }
  );

  const refresh = async () => {
    await userRequest.refreshAsync();
  };

  const loggedIn = computed(() => {
    return Boolean(authStore.value);
  });
  const currentUser = computed(() => authStore.value);
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
  const register = async (params: {
    name: string;
    email: string;
    password: string;
  }) => {
    return await $fetch("/api/user/register", {
      method: "post",
      body: {
        name: params.name,
        email: params.email,
        password: params.password,
      },
    });
  };
  onMounted(() => {
    refresh();
  });
  return {
    loggedIn,
    login,
    logout,
    register,
    currentUser,
    refresh,
  };
};
