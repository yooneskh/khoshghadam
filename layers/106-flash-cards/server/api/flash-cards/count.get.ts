

export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCards',
    event,
    // permission: 'admin.flash-cards.count',
  });
});
