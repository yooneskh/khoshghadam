

export default defineEventHandler(async event => {

  const user = await assertUser({ event });
  const body = await readBody(event);


  return event.context.flashCardSessions.dbo.create({
    document: {
      user: user._id,
      flashCard: body.flashCard,
      answeredCards: [],
    },
  });

});
