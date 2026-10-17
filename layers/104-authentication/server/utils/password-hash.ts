
/* responsibility */

// Hashes passwords with argon2id
// and verifies them against stored hashes.
// Older bcrypt hashes stay verifiable.


export async function hashPassword(password: string): Promise<string> {
  return await Bun.password.hash(password);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await Bun.password.verify(password, hashedPassword);
}
