

export default defineEventHandler(async event => {
  return handleResourceDelete({
    resource: 'flashCards',
    event,
    // permission: 'admin.flash-cards.delete',
  });
});
