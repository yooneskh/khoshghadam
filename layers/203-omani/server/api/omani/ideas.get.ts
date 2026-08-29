

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
    sort: sort === 'new' ? { createdAt: -1 } : { voteCount: -1, createdAt: -1 },
    skip,
    limit,
    populate: {
      author: ['name', 'username'],
    },
  });


  if (!user) {
    return ideas.map(idea => ({
      ...idea,
      myVote: false,
    }));
  }


  const votes = await app.omaniIdeaVotes.dbo.list({
    filter: {
      user: user._id,
      idea: {
        $in: ideas.map(idea => idea._id),
      },
    },
  });


  const votedIds = new Set(votes.map(vote => vote.idea));


  return ideas.map(idea => ({
    ...idea,
    myVote: votedIds.has(idea._id),
  }));

});
