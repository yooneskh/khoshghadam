
/* responsibility */

// Returns the flash cards resource schema
// for admins with schema permission.


export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.schema',
  });
});
