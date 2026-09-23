

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  const journeySlug = getRouterParam(event, 'journeySlug');

  if (!journeySlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'flash card journey slug is required',
    });
  }


  const journey = await app.flashCardJourneys.dbo.find({
    filter: {
      slug: journeySlug,
    },
  });

  if (!journey) {
    throw createError({
      statusCode: 404,
      statusMessage: 'flash card journey does not exist',
    });
  }


  const journeys = await loadFlashCardJourneyStates({
    journeys: [
      journey,
    ],
    userId: user._id,
  });


  return journeys[0];

});
