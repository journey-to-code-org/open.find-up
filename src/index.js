import { access } from "node:fs/promises";
import path from "node:path";

async function exists(value) {
  try { await access(value); return true; } catch { return false; }
}

export async function findUp(names, options = {}) {
  const list = Array.isArray(names) ? names : [names];
  if (list.length === 0 || list.some((name) => typeof name !== "string" || !name)) {
    throw new TypeError("Expected one or more names");
  }

  let current = path.resolve(options.cwd ?? process.cwd());
  const stopAt = path.resolve(options.stopAt ?? path.parse(current).root);

  while (true) {
    for (const name of list) {
      const candidate = path.join(current, name);
      if (await exists(candidate)) return candidate;
    }

    if (current === stopAt) break;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}
