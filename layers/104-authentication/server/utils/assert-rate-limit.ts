

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();


export async function assertRateLimit(args: { event: H3Event; limit?: number; windowSeconds?: number }) {

  const limit = args.limit ?? 20;
  const windowSeconds = args.windowSeconds ?? 60;


  const ip = getRequestIP(args.event, {
    xForwardedFor: true,
  }) ?? 'unknown';

  const storeKey = `${args.event.path}:${ip}`;
  const now = Date.now();


  let entry = rateLimitStore.get(storeKey);

  if (!entry || entry.resetAt <= now) {
    entry = {
      count: 0,
      resetAt: now + windowSeconds * 1000,
    };
  }


  entry.count += 1;
  rateLimitStore.set(storeKey, entry);


  if (entry.count > limit) {

    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

    setResponseHeaders(args.event, {
      'Retry-After': String(retryAfterSeconds),
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
    });

    throw createError({
      statusCode: 429,
      statusMessage: 'too many requests',
    });

  }


  if (rateLimitStore.size > 10_000) {
    for (const [storedKey, storedEntry] of rateLimitStore) {
      if (storedEntry.resetAt <= now) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

}
