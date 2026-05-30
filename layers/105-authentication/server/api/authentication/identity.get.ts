

export default defineEventHandler(async event => {
  return assertUser({
    event,
    fillPermissions: true,
  });
});
