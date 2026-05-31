

export default defineEventHandler(async event => {
  return handleResourceList({
    resource: 'flashCards',
    event,
  });
});
