
/* responsibility */

// Builds the 401 errors that server routes
// throw for failed authentication.


export function createUnauthenticatedError() {
  return createError({
    statusCode: 401,
    statusMessage: 'invalid credentials',
  });
}

export function createUnauthorizedError() {
  return createError({
    statusCode: 401,
    statusMessage: 'unauthorized',
  });
}
