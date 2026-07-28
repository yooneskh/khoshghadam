

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.schema',
  });
});
