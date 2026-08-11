

export default defineEventHandler(async () => {

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
