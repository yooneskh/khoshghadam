

export default defineEventHandler(async event => {
  return event.context.users.list({
    filter: {},
    sort: {},
    skip: 0,
    limit: 10,
  });
});
