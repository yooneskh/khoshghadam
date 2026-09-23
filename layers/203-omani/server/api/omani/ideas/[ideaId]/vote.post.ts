

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  await assertRateLimit({
    event,
    limit: 60,
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


  const existingVote = await app.omaniIdeaVotes.dbo.find({
    filter: {
      idea: idea._id,
      user: user._id,
    },
  });


  if (existingVote) {

    await app.omaniIdeaVotes.dbo.delete({
      resourceId: existingVote._id,
    });

    await app.omaniIdeas.dbo.updateQuery({
      resourceId: idea._id,
      query: {
        $inc: {
          voteCount: -1,
        },
      },
    });

  }
  else {

    await app.omaniIdeaVotes.dbo.create({
      document: {
        idea: idea._id,
        user: user._id,
      },
    });

    await app.omaniIdeas.dbo.updateQuery({
      resourceId: idea._id,
      query: {
        $inc: {
          voteCount: 1,
        },
      },
    });

  }


  return {
    ...await app.omaniIdeas.dbo.retrieve({
      resourceId: idea._id,
      populate: {
        author: ['name', 'username'],
      },
    }),
    myVote: !existingVote,
  };

});
