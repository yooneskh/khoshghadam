

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await assertBody({
    event,
    schema: {
      'flashCard': 'string',
    },
  });


  return app.flashCardSessions.dbo.create({
    document: {
      user: user._id,
      flashCard: body.flashCard,
      answeredCards: [],
    },
  });

});
