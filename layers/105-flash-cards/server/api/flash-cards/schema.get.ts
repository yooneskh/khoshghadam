

export default defineEventHandler(async event => {
  return handleResourceSchema({
    resource: 'flashCards',
    event,
  });
});
