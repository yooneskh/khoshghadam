

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCards',
    event,
    // permission: 'admin.flash-cards.retrieve',
  });
});
