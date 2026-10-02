
/* responsibility */

// Returns the authenticated user
// with their permissions filled in.


export default defineEventHandler(async event => {
  return assertUser({
    event,
    fillPermissions: true,
  });
});
