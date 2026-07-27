/**
 * Progress lives in localStorage. No backend, no account, and it survives a
 * refresh — which is the whole point of a study tool.
 */

const KEY = "java-concepts:progress:v1";

export type Progress = Record<string, { seen: number; correct: number; last: number }>;

export function readProgress(): Progress {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as Progress;
  } catch {
    return {};
  }
}

export function recordAnswer(questionId: string, correct: boolean): Progress {
  const all = readProgress();
  const entry = all[questionId] ?? { seen: 0, correct: 0, last: 0 };
  all[questionId] = {
    seen: entry.seen + 1,
    correct: entry.correct + (correct ? 1 : 0),
    last: Date.now(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage full or blocked — progress is a nicety, not a requirement */
  }
  return all;
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}

const CONCEPTS_KEY = "java-concepts:progress:concepts:v1";

/** Concept slugs the user has visited. Shared across locales — the slug is the same either way. */
export function readCompletedConcepts(): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(CONCEPTS_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export function markConceptRead(slug: string): void {
  const all = readCompletedConcepts();
  if (all.has(slug)) return;
  all.add(slug);
  try {
    localStorage.setItem(CONCEPTS_KEY, JSON.stringify([...all]));
  } catch {
    /* storage full or blocked — progress is a nicety, not a requirement */
  }
}

/** Normalises output so trailing whitespace never fails a correct answer. */
export function normalise(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
