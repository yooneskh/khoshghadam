

export default defineSitemapEventHandler(async () => {

  const data = await Promise.all([
    $fetch('/api/flash-cards') as Promise<any[]>,
  ]);


  return [
    ...data[0]!.map(it => `/flash-cards/${it.slug}`),
  ].flat(Infinity);

});
