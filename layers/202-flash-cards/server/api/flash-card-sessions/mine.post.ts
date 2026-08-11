

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await assertBody({
    event,
    schema: {
      'flashCard': 'string',
    },
  });


  const flashCard = await app.flashCards.dbo.find({
    resourceId: body.flashCard,
  });

  if (!flashCard) {
    throw createError({
      statusCode: 404,
      statusMessage: 'flash card does not exist',
    });
  }


  return app.flashCardSessions.dbo.create({
    document: {
      user: user._id,
      flashCard: body.flashCard,
      answeredCards: [],
    },
  });

});
