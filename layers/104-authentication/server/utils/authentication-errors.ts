

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
