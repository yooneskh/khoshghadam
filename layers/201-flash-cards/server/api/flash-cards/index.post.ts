

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCards',
    event,
    permission: 'admin.flash-cards.create',
  });
});
