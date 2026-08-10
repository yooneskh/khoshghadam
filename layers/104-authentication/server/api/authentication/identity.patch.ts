

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await assertBody({
    event,
    schema: {
      'name': 'string',
    },
  });


  return app.users.dbo.update({
    resourceId: user._id,
    document: {
      name: body.name,
    },
  });

});
