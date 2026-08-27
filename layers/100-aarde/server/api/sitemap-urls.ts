

export default defineSitemapEventHandler(async () => {

  const [flashCards, flashCardJourneys] = await Promise.all([
    app.flashCards.dbo.list({
      select: [
        'slug',
      ],
    }),
    app.flashCardJourneys.dbo.list({
      select: [
        'slug',
      ],
    }),
  ]);


  return [
    ...flashCards.map(it => `/flash-cards/${it.slug}`),
    ...flashCardJourneys.map(it => `/flash-card-journeys/${it.slug}`),
  ];

});
