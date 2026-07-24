/**
 * Cross-checks the question bank against the concept files, for each
 * locale, plus parity between locales (same concept slugs, same question
 * ids with matching structural fields). Astro validates frontmatter, but
 * nothing else validates any of this.
 *   node scripts/check-content.mjs
 */
import { readFileSync, readdirSync } from "node:fs";

const LOCALES = [
  { label: "en", conceptsDir: "src/content/concepts", questionsPath: "src/data/questions.json" },
  { label: "fr", conceptsDir: "src/content/concepts-fr", questionsPath: "src/data/questions.fr.json" },
];

const problems = [];

function checkLocale({ label, conceptsDir, questionsPath }) {
  const concepts = readdirSync(conceptsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const questions = JSON.parse(readFileSync(questionsPath, "utf8"));

  const offsets = new Map();
  for (const slug of concepts) {
    const body = readFileSync(`${conceptsDir}/${slug}.md`, "utf8");
    const offset = body.match(/^offset:\s*(\d+)$/m)?.[1];
    if (!offset) problems.push(`[${label}] ${slug}: missing offset`);
    else if (offsets.has(offset)) problems.push(`[${label}] offset ${offset} used by ${offsets.get(offset)} and ${slug}`);
    else offsets.set(offset, slug);
  }

  const ids = new Set();
  for (const q of questions) {
    if (ids.has(q.id)) problems.push(`[${label}] duplicate question id ${q.id}`);
    ids.add(q.id);

    if (!concepts.includes(q.concept)) problems.push(`[${label}] ${q.id}: unknown concept "${q.concept}"`);

    if (q.type === "mcq" && (!Array.isArray(q.options) || q.options[q.answer] === undefined))
      problems.push(`[${label}] ${q.id}: answer index out of range`);

    if (q.type === "fill") {
      const slots = (q.code ?? "").split("___").length - 1;
      if (slots !== (q.blanks ?? []).length)
        problems.push(`[${label}] ${q.id}: ${slots} blanks in code, ${(q.blanks ?? []).length} answers`);
    }

    if ((q.type === "output" || q.type === "flashcard") && !q.expected)
      problems.push(`[${label}] ${q.id}: missing expected`);
  }

  const orphans = concepts.filter((c) => !questions.some((q) => q.concept === c));
  if (orphans.length) problems.push(`[${label}] concepts with no questions: ${orphans.join(", ")}`);

  return { concepts, questions };
}

const [en, fr] = LOCALES.map(checkLocale);

// Every concept must have a translation on the other side, same slug.
const enSlugs = new Set(en.concepts);
const frSlugs = new Set(fr.concepts);
for (const slug of enSlugs) if (!frSlugs.has(slug)) problems.push(`concepts-fr: missing translation for "${slug}"`);
for (const slug of frSlugs) if (!enSlugs.has(slug)) problems.push(`concepts-fr: "${slug}" has no English source concept`);

// Every question must exist in both locales with identical structural fields
// (only prose — prompt/options/explanation/expected — is allowed to differ).
const enById = new Map(en.questions.map((q) => [q.id, q]));
const frById = new Map(fr.questions.map((q) => [q.id, q]));
for (const [id, q] of enById) {
  const fq = frById.get(id);
  if (!fq) {
    problems.push(`questions.fr.json: missing translation for ${id}`);
    continue;
  }
  if (fq.type !== q.type) problems.push(`${id}: type differs between locales (${q.type} vs ${fq.type})`);
  if (fq.concept !== q.concept) problems.push(`${id}: concept differs between locales`);
  if (JSON.stringify(fq.code ?? null) !== JSON.stringify(q.code ?? null))
    problems.push(`${id}: code differs between locales`);
  if (JSON.stringify(fq.blanks ?? null) !== JSON.stringify(q.blanks ?? null))
    problems.push(`${id}: blanks differ between locales`);
  if ((fq.answer ?? null) !== (q.answer ?? null)) problems.push(`${id}: mcq answer index differs between locales`);
}
for (const id of frById.keys()) if (!enById.has(id)) problems.push(`questions.fr.json: ${id} has no English source question`);

if (problems.length) {
  console.error("Content problems:\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(
  `OK — en: ${en.concepts.length} concepts, ${en.questions.length} questions · ` +
    `fr: ${fr.concepts.length} concepts, ${fr.questions.length} questions.`
);
