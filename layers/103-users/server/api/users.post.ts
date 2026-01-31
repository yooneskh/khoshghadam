import { db, schema } from '@nuxthub/db';


export default defineEventHandler(async () => {
  return await (
    db.insert(schema.users)
      .values({
        username: 'yooneskh',
        password: 'password',
      })
      .returning()
  );
});
