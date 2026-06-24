

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.count',
  });
});
