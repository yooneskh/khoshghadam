

export default defineEventHandler(async event => {

  const user = await assertUser(event);
  const body = await readBody(event);


  return event.context.users.dbo.update({
    resourceId: user._id,
    document: {
      name: body.name,
    },
  });

});
