

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.schema',
  });
});
