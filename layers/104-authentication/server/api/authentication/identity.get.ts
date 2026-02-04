

export default defineEventHandler(async event => {
  return await assertUser(event);
});
