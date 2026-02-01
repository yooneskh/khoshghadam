

export default defineEventHandler(async event => {

  const db = await loadDbClient(event);
  const users = db.collection('users');

  return users.insertOne({
    _id: '2' as any,
    username: 'yooneskh',
    password: 'password',
    createdAt: Date.now(),
  });

});
