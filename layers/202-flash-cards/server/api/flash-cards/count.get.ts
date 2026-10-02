
/* responsibility */

// Counts flash cards
// matching the request query.


export default defineEventHandler(async event => {
  return handleResourceCount({
    resource: 'flashCards',
    event,
  });
});
