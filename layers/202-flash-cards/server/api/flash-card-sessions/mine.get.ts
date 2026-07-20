

export default defineEventHandler(async event => {

  const user = await assertUser({ event });


  return resources.flashCardSessions.dbo.list({
    filter: {
      user: user._id,
    },
    sort: {
      _id: -1,
    },
  });

});
