

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  await assertRateLimit({
    event,
    limit: 20,
    windowSeconds: 60 * 60,
  });


  const idea = await app.omaniIdeas.dbo.find({
    resourceId: getRouterParam(event, 'ideaId'),
  });

  if (!idea || idea.status !== 'published') {
    throw createError({
      statusCode: 404,
      statusMessage: 'idea not found',
    });
  }


  const body = await assertBody({
    event,
    schema: {
      'body': '1 <= string <= 500',
    },
  });


  const comment = await app.omaniIdeaComments.dbo.create({
    document: {
      idea: idea._id,
      author: user._id,
      body: body.body,
    },
  });

  await app.omaniIdeas.dbo.updateQuery({
    resourceId: idea._id,
    query: {
      $inc: {
        commentCount: 1,
      },
    },
  });


  return app.omaniIdeaComments.dbo.retrieve({
    resourceId: comment._id,
    populate: {
      author: [
        'name',
        'username',
      ],
    },
  });

});
