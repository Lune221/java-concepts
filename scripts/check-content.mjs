/**
 * Cross-checks the question bank against the concept files.
 * Astro validates frontmatter, but nothing validates the link between them.
 *   node scripts/check-content.mjs
 */
import { readFileSync, readdirSync } from "node:fs";

const concepts = readdirSync("src/content/concepts")
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const questions = JSON.parse(readFileSync("src/data/questions.json", "utf8"));
const problems = [];

const offsets = new Map();
for (const slug of concepts) {
  const body = readFileSync(`src/content/concepts/${slug}.md`, "utf8");
  const offset = body.match(/^offset:\s*(\d+)$/m)?.[1];
  if (!offset) problems.push(`${slug}: missing offset`);
  else if (offsets.has(offset)) problems.push(`offset ${offset} used by ${offsets.get(offset)} and ${slug}`);
  else offsets.set(offset, slug);
}

const ids = new Set();
for (const q of questions) {
  if (ids.has(q.id)) problems.push(`duplicate question id ${q.id}`);
  ids.add(q.id);

  if (!concepts.includes(q.concept)) problems.push(`${q.id}: unknown concept "${q.concept}"`);

  if (q.type === "mcq" && (!Array.isArray(q.options) || q.options[q.answer] === undefined))
    problems.push(`${q.id}: answer index out of range`);

  if (q.type === "fill") {
    const slots = (q.code ?? "").split("___").length - 1;
    if (slots !== (q.blanks ?? []).length)
      problems.push(`${q.id}: ${slots} blanks in code, ${(q.blanks ?? []).length} answers`);
  }

  if ((q.type === "output" || q.type === "flashcard") && !q.expected)
    problems.push(`${q.id}: missing expected`);
}

const orphans = concepts.filter((c) => !questions.some((q) => q.concept === c));
if (orphans.length) problems.push(`concepts with no questions: ${orphans.join(", ")}`);

if (problems.length) {
  console.error("Content problems:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`OK — ${concepts.length} concepts, ${questions.length} questions.`);
