

export default defineEventHandler(async event => {
  return event.context.flashCards.create({
    document: await readBody(event),
  });
});
