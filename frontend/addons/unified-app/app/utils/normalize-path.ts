import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


export function normalizePathToCwd(currentBase: string, path: string) {
  const currentDir = dirname(fileURLToPath(currentBase));
  return join(currentDir, path);
}
