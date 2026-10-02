
/* responsibility */

// Updates one flash card
// for admins.


export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.update',
  });
});
