import { access_token_name } from "~/server/utils/jwt";

export default defineEventHandler(async (event) => {
  setCookie(event, access_token_name, "");
  return true;
});
