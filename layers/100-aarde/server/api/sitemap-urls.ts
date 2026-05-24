

export default defineSitemapEventHandler(async () => {

  const data: any[][] = await Promise.all([
    $fetch('/api/flash-cards'),
  ]);


  return [
    ...data[0]!.map(it => `/flash-cards/${it.slug}`),
  ].flat(Infinity);

});
