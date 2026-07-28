

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.update',
  });
});
