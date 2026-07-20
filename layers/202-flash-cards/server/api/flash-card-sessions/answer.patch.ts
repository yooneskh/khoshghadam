

export default defineEventHandler(async event => {

  const user = await assertUser({ event });
  const body = await readBody(event);


  const flashCardSession = await resources.flashCardSessions.dbo.retrieve({
    resourceId: body.flashCardSession,
  });

  if (flashCardSession.user !== user._id) {
    throw createUnauthorizedError();
  }


  return resources.flashCardSessions.dbo.update({
    resourceId: flashCardSession._id,
    document: {
      answeredCards: [
        ...flashCardSession.answeredCards.filter(it => it.card !== body.card),
        {
          card: body.card,
          opened: body.opened,
        },
      ],
    },
  });

});
