

export default defineEventHandler(async event => {

  const user = await assertUser({
    event,
  });


  await assertRateLimit({
    event,
    limit: 5,
    windowSeconds: 60 * 60,
  });


  const body = await assertBody({
    event,
    schema: {
      'name': '4 <= string <= 80',
      'body?': 'string <= 2000',
    },
  });


  const idea = await app.omaniIdeas.dbo.create({
    document: {
      name: body.name,
      ...(body.body === undefined ? {} : {
        body: body.body,
      }),
      author: user._id,
      status: 'published',
      voteCount: 0,
      commentCount: 0,
    },
  });


  return {
    ...await app.omaniIdeas.dbo.retrieve({
      resourceId: idea._id,
      populate: {
        author: [
          'name',
          'username',
        ],
      },
    }),
    myVote: false,
  };

});
