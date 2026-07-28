

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.create',
  });
});
