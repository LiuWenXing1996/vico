export default defineEventHandler(async (event) => {
  let isLogin = false;
  try {
    isLogin = Boolean(jwtVerify(event));
  } catch (error) {
    isLogin = false;
  }
  return isLogin;
});
