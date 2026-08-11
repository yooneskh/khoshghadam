

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await assertBody({
    event,
    schema: {
      'flashCardSession': 'string',
      'card': 'string',
      'opened': 'boolean',
    },
  });


  const flashCardSession = await app.flashCardSessions.dbo.find({
    resourceId: body.flashCardSession,
  });

  if (!flashCardSession) {
    throw createError({
      statusCode: 404,
      statusMessage: 'flash card session does not exist',
    });
  }

  if (flashCardSession.user !== user._id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'flash card session belongs to another user',
    });
  }


  const flashCard = await app.flashCards.dbo.find({
    resourceId: flashCardSession.flashCard,
  });

  if (!flashCard) {
    throw createError({
      statusCode: 404,
      statusMessage: 'flash card for this session does not exist',
    });
  }

  if (!flashCard.cards.some(it => it._id === body.card)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'card does not belong to this flash card',
    });
  }


  const currentCompletion = calculateFlashCardSessionCompletion({
    session: flashCardSession,
    flashCard,
  });

  if (flashCardSession.finishedAt !== undefined || currentCompletion.finished) {
    throw createError({
      statusCode: 409,
      statusMessage: 'finished flash card sessions cannot be changed',
    });
  }


  const answeredCards = [
    ...flashCardSession.answeredCards.filter(it => it.card !== body.card),
    {
      card: body.card,
      opened: body.opened,
    },
  ];

  const completion = calculateFlashCardSessionCompletion({
    session: {
      flashCard: flashCardSession.flashCard,
      answeredCards,
    },
    flashCard,
  });


  return app.flashCardSessions.dbo.update({
    resourceId: flashCardSession._id,
    document: {
      answeredCards,
      ...(!completion.finished ? {} : {
        finishedAt: Date.now(),
        successful: completion.successful,
      }),
    },
  });

});
