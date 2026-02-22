

export default defineEventHandler(async event => {
  return event.context.flashCardCategories.list({
    filter: {},
    sort: {},
    skip: 0,
    limit: 10,
  });
});
