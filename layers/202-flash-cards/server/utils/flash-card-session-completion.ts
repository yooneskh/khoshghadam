
/* responsibility */

// Decides whether a flash card session
// is finished and successful.


interface FlashCardAnswer {
  card: string;
  opened: boolean;
}

export interface FlashCardSessionForCompletion {
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


export function calculateFlashCardSessionCompletion(args: { session: FlashCardSessionForCompletion, flashCard: FlashCardDeckForCompletion }) {

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
