

export default defineEventHandler(async event => {

  const user = await assertUser({ event });

  const body = await ensureBody({
    event,
    schema: {
      'name': 'string',
    },
  });


  return resources.users.dbo.update({
    resourceId: user._id,
    document: {
      name: body.name,
    },
  });

});
