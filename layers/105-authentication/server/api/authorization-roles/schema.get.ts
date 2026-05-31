

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'authorizationRoles',
    event,
    permission: 'admin.authorization-roles.schema',
  });
});
