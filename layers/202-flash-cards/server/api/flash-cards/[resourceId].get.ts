
/* responsibility */

// Retrieves a single flash card
// by its id.


export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCards',
    event,
  });
});
