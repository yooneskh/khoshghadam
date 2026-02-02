

export default defineEventHandler(async event => {
  return event.context.users.create({
    document: await readBody(event),
  });
});
