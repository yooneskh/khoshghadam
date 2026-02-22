

export default defineEventHandler(async event => {
  return event.context.flashCards.list({
    filter: {},
    sort: {},
    skip: 0,
    limit: 10,
  });
});
