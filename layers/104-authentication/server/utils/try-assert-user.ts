
/* responsibility */

// Returns the authenticated user of a request,
// or undefined when the request is not authenticated.


export async function tryAssertUser(event: H3Event) {
  try {
    return await assertUser({
      event,
    });
  }
  catch {
    return undefined;
  }
}
