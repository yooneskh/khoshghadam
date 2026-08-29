

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
