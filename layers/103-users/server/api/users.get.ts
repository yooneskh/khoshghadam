

export default defineEventHandler(async event => {

  const db = await loadDbClient(event);
  const users = db.collection('users');

  return users.find().toArray();

});
