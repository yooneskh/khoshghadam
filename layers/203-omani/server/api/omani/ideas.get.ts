

function getIdeasSort(sort: string) {
  if (sort === 'new') {
    return {
      createdAt: -1,
    };
  }
  else {
    return {
      voteCount: -1,
      createdAt: -1,
    };
  }
}


export default defineEventHandler(async event => {

  const user = await tryAssertUser(event);
  const query = getQuery(event);


  const sort = typeof query.sort === 'string' ? query.sort : 'hot';
  const search = typeof query.q === 'string' ? query.q : '';
  const skip = Math.max(0, Math.trunc(Number(query.skip ?? 0)) || 0);
  const limit = Math.min(50, Math.max(1, Math.trunc(Number(query.limit ?? 30)) || 30));


  const filter: Record<string, unknown> = {
    status: 'published',
  };

  if (search) {
    filter.name = {
      $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }


  const ideas = await app.omaniIdeas.dbo.list({
    filter,
    sort: getIdeasSort(sort),
    skip,
    limit,
    populate: {
      author: [
        'name',
        'username',
      ],
    },
  });


  if (!user) {
    return ideas.map(it => ({
      ...it,
      myVote: false,
    }));
  }


  const votes = await app.omaniIdeaVotes.dbo.list({
    filter: {
      user: user._id,
      idea: {
        $in: ideas.map(it => it._id),
      },
    },
  });


  const votedIds = new Set(votes.map(it => it.idea));


  return ideas.map(it => ({
    ...it,
    myVote: votedIds.has(it._id),
  }));

});
