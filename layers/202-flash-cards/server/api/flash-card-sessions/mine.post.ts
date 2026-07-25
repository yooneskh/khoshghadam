

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await ensureBody({
    event,
    schema: {
      'flashCard': 'string',
    },
  });


  return resources.flashCardSessions.dbo.create({
    document: {
      user: user._id,
      flashCard: body.flashCard,
      answeredCards: [],
    },
  });

});
