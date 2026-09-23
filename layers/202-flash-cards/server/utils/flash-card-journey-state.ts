

interface FlashCardAnswer {
  card: string;
  opened: boolean;
}

interface FlashCardSessionForCompletion {
  flashCard: string;
  answeredCards: FlashCardAnswer[];
  successful?: boolean;
}

interface FlashCardDeckForCompletion {
  _id: string;
  cards: {
    _id: string;
  }[];
}


export function calculateFlashCardSessionCompletion(args: {
  session: FlashCardSessionForCompletion;
  flashCard: FlashCardDeckForCompletion;
}) {

  const canonicalCardIds = args.flashCard.cards.map(it => it._id);
  const answeredCardIds = args.session.answeredCards.map(it => it.card);
  const uniqueAnsweredCardIds = new Set(answeredCardIds);
  const finished = canonicalCardIds.length > 0 && answeredCardIds.length === canonicalCardIds.length && uniqueAnsweredCardIds.size === canonicalCardIds.length && canonicalCardIds.every(it => uniqueAnsweredCardIds.has(it));
  const successful = finished && args.session.answeredCards.every(it => it.opened === false);


  return {
    finished,
    successful,
  };

}

export async function loadFlashCardJourneyStates(args: {
  journeys: any[];
  userId?: string;
  skipInvalid?: boolean;
}) {

  if (!args.journeys.length) {
    return [];
  }


  const flashCardIds = [
    ...new Set(args.journeys.flatMap(it => it.steps?.map((step: any) => step.flashCard) ?? [])),
  ];

  const flashCards = await app.flashCards.dbo.list({
    filter: {
      _id: {
        $in: flashCardIds,
      },
    },
  });

  const sessions = !args.userId ? [] : await app.flashCardSessions.dbo.list({
    filter: {
      user: args.userId,
      flashCard: {
        $in: flashCardIds,
      },
    },
  });


  const journeyStates = [];

  for (const journey of args.journeys) {
    try {
      journeyStates.push(deriveFlashCardJourneyState({
        journey,
        flashCards,
        sessions,
      }));
    }
    catch (error) {
      if (!args.skipInvalid) {
        throw error;
      }
    }
  }


  return journeyStates;

}

export function deriveFlashCardJourneyState(args: {
  journey: any;
  flashCards: any[];
  sessions: FlashCardSessionForCompletion[];
}) {

  if (!args.journey.steps?.length) {
    throw createError({
      statusCode: 422,
      statusMessage: `flash card journey "${args.journey.slug}" has no steps`,
    });
  }


  const flashCardsById = new Map(args.flashCards.map(it => [it._id, it]));

  for (const step of args.journey.steps) {
    const flashCard = flashCardsById.get(step.flashCard);

    if (!flashCard) {
      throw createError({
        statusCode: 422,
        statusMessage: `flash card journey "${args.journey.slug}" references a missing flash card`,
      });
    }

    if (!flashCard.cards?.length) {
      throw createError({
        statusCode: 422,
        statusMessage: `flash card "${flashCard.slug ?? flashCard._id}" has no cards`,
      });
    }
  }


  const successfulFlashCardIds = new Set(
    args.sessions
      .filter(session => {

        if (session.successful === true) {
          return true;
        }


        const flashCard = flashCardsById.get(session.flashCard);

        return flashCard && calculateFlashCardSessionCompletion({
          session,
          flashCard,
        }).successful;

      })
      .map(it => it.flashCard),
  );

  const steps = args.journey.steps.map((step: any, index: number) => {

    const completed = successfulFlashCardIds.has(step.flashCard);
    const previousStep = args.journey.steps[index - 1];
    const unlocked = index === 0 || successfulFlashCardIds.has(previousStep.flashCard);


    return {
      ...step,
      flashCard: flashCardsById.get(step.flashCard),
      completed,
      unlocked,
    };

  });


  return {
    ...args.journey,
    steps,
    completed: steps.every((it: any) => it.completed),
  };

}
