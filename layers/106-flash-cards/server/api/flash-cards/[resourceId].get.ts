

export default defineEventHandler(async event => {
  return handleResourceRetrieve({
    resource: 'flashCards',
    event,
  });
});
