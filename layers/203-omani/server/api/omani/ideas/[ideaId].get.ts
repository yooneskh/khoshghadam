

export default defineEventHandler(async event => {

  const user = await tryAssertUser(event);


  const idea = await app.omaniIdeas.dbo.find({
    resourceId: getRouterParam(event, 'ideaId'),
    populate: {
      author: ['name', 'username'],
    },
  });

  if (!idea || idea.status !== 'published') {
    throw createError({
      statusCode: 404,
      statusMessage: 'idea not found',
    });
  }


  const comments = await app.omaniIdeaComments.dbo.list({
    filter: {
      idea: idea._id,
    },
    sort: {
      createdAt: 1,
    },
    populate: {
      author: ['name', 'username'],
    },
  });


  return {
    ...idea,
    myVote: !!user && !!await app.omaniIdeaVotes.dbo.find({
      filter: {
        idea: idea._id,
        user: user._id,
      },
    }),
    comments,
  };

});
