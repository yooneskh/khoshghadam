

export default defineEventHandler(async event => {
  return handleResourceCreate({
    resource: 'flashCards',
    event,
  });
});
