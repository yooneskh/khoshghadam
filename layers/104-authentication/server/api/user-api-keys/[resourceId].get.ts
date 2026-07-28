

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'userApiKeys',
    event,
    permission: 'admin.user-api-keys.retrieve',
  });
});
