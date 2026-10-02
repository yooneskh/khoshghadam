
/* responsibility */

// Lists every valid flash card journey
// with its state, for any visitor.


export default defineEventHandler(async event => {

  const journeys = await app.flashCardJourneys.dbo.list({
    sort: {
      createdAt: 1,
    },
  });


  return loadFlashCardJourneyStates({
    journeys,
    skipInvalid: true,
  });

});
