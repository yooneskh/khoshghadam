
/* responsibility */

// Generates a time-ordered
// UUIDv7 string.


export function generateUuid(): string {
  return Bun.randomUUIDv7();
}
