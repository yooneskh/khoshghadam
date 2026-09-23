

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const body = await assertBody({
    event,
    schema: {
      'flashCard': 'string',
      'answeredCards': [{
        'card': 'string',
        'opened': 'boolean',
      }, '[]'],
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


  const flashCardCardIds = new Set(flashCard.cards.map(it => it._id));

  if (body.answeredCards.some(it => !flashCardCardIds.has(it.card))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'card does not belong to this flash card',
    });
  }


  const completion = calculateFlashCardSessionCompletion({
    session: {
      flashCard: body.flashCard,
      answeredCards: body.answeredCards,
    },
    flashCard,
  });


  return app.flashCardSessions.dbo.create({
    document: {
      user: user._id,
      flashCard: body.flashCard,
      answeredCards: body.answeredCards,
      ...(!completion.finished ? {} : {
        finishedAt: Date.now(),
        successful: completion.successful,
      }),
    },
  });

});
