export default defineEventHandler(async () => {
  const tpl = await getAppTpl();
  return tpl;
});
