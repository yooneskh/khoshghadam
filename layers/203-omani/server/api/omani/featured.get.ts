

export default defineEventHandler(async event => {

  const user = await tryAssertUser(event);
  const today = new Date().toISOString().slice(0, 10);


  const existing = await app.omaniIdeas.dbo.find({
    filter: {
      status: 'published',
      featuredOn: today,
    },
    populate: {
      author: ['name', 'username'],
    },
  });

  if (existing) {
    return {
      ...existing,
      myVote: !!user && !!await app.omaniIdeaVotes.dbo.find({
        filter: {
          idea: existing._id,
          user: user._id,
        },
      }),
    };
  }


  let [candidate] = await app.omaniIdeas.dbo.list({
    filter: {
      status: 'published',
      featuredOn: {
        $exists: false,
      },
    },
    sort: {
      voteCount: -1,
      createdAt: -1,
    },
    limit: 1,
    populate: {
      author: ['name', 'username'],
    },
  });


  if (!candidate) {

    const publishedCount = await app.omaniIdeas.dbo.count({
      filter: {
        status: 'published',
      },
    });

    if (!publishedCount) {
      return null;
    }


    const previouslyFeatured = await app.omaniIdeas.dbo.list({
      filter: {
        featuredOn: {
          $exists: true,
        },
      },
    });

    await Promise.all(
      previouslyFeatured.map(idea =>
        app.omaniIdeas.dbo.updateQuery({
          resourceId: idea._id,
          query: {
            $unset: {
              featuredOn: 1,
            },
          },
        }),
      ),
    );


    [candidate] = await app.omaniIdeas.dbo.list({
      filter: {
        status: 'published',
      },
      sort: {
        voteCount: -1,
        createdAt: -1,
      },
      limit: 1,
      populate: {
        author: ['name', 'username'],
      },
    });

  }


  if (!candidate) {
    return null;
  }


  const featured = await app.omaniIdeas.dbo.update({
    resourceId: candidate._id,
    document: {
      featuredOn: today,
    },
  });


  return {
    ...candidate,
    featuredOn: featured.featuredOn,
    myVote: !!user && !!await app.omaniIdeaVotes.dbo.find({
      filter: {
        idea: candidate._id,
        user: user._id,
      },
    }),
  };

});
