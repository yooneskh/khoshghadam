
/* responsibility */

// Lists flash cards
// matching the request query.


export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCards',
    event,
  });
});
