

export default defineSitemapEventHandler(async () => {

  const data = await Promise.all([
    $fetch('/api/flash-cards') as Promise<any[]>,
    $fetch('/api/flash-card-journeys') as Promise<any[]>,
  ]);


  return [
    ...data[0]!.map(it => `/flash-cards/${it.slug}`),
    ...data[1]!.map(it => `/flash-card-journeys/${it.slug}`),
  ].flat(Infinity);

});
