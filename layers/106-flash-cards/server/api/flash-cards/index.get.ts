

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCards',
    event,
    // permission: 'admin.flash-cards.list',
  });
});
