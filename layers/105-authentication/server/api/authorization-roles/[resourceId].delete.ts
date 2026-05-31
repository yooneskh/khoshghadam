

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.delete',
  });
});
