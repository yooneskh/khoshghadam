

export default defineEventHandler(async event => {
  return handleResourceUpdate({
    resource: 'flashCards',
    event,
  });
});
