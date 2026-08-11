

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const journeys = await app.flashCardJourneys.dbo.list({
    sort: {
      createdAt: 1,
    },
  });


  return loadFlashCardJourneyStates({
    journeys,
    userId: user._id,
    skipInvalid: true,
  });

});
