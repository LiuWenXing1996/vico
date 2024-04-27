import { useRequest } from "vue-request";
import { type InternalApi } from "nitropack";

type User = InternalApi["/api/user/current"]["get"];
const store = shallowRef<User>();

export const useCurrentUser = () => {
  const userRequest = useRequest(
    async () => {
      let user: User | undefined = undefined;
      try {
        // @ts-ignore
        user = await $fetch("/api/user/current");
      } catch (error) {}
      store.value = user;
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
  const logout = async () => {
    await $fetch("/api/user/logout");
    await navigateTo("/studio", { external: true });
  };
  onMounted(() => {
    refresh();
  });
  return {
    loggedIn,
    logout,
    currentUser,
    refresh,
  };
};
