export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!to.meta.disableAuth) {
    console.log("===>ss");
    const { data } = await useFetch("/api/auth/isLogin");
    const isLogin = data.value;
    console.log(isLogin);
    if (!isLogin) {
      return navigateTo("/auth/login");
    }
  }
});
