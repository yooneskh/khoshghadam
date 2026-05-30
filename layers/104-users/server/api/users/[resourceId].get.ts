

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'users',
    event,
    // permission: 'admin.users.retrieve',
  });
});
