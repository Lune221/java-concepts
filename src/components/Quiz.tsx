import { useMemo, useState } from "react";
import { normalise, recordAnswer } from "../lib/progress";

export type Question = {
  id: string;
  concept: string;
  type: "mcq" | "output" | "flashcard" | "fill";
  prompt: string;
  code?: string;
  options?: string[];
  answer?: number;
  expected?: string;
  blanks?: string[];
  explanation?: string;
};

type Props = { questions: Question[]; titles: Record<string, string> };

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Honours ?concept=slug so "Drill it" links work without a separate page. */
function select(all: Question[]): Question[] {
  if (typeof location === "undefined") return all;
  const wanted = new URLSearchParams(location.search).get("concept");
  if (!wanted) return all;
  const filtered = all.filter((q) => q.concept === wanted);
  return filtered.length > 0 ? filtered : all;
}

export default function Quiz({ questions, titles }: Props) {
  const pool = useMemo(() => select(questions), [questions]);
  const [order, setOrder] = useState(() => shuffle(pool));
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [blanks, setBlanks] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const q = order[index];
  const done = index >= order.length;

  const correct = useMemo(() => {
    if (!q) return false;
    switch (q.type) {
      case "mcq":
        return choice === q.answer;
      case "output":
        return normalise(typed) === normalise(q.expected ?? "");
      case "fill":
        return (q.blanks ?? []).every(
          (b, i) => normalise(blanks[i] ?? "").toLowerCase() === normalise(b).toLowerCase()
        );
      case "flashcard":
        return true; // self-assessed below
    }
  }, [q, choice, typed, blanks]);

  function next(wasCorrect: boolean) {
    recordAnswer(q.id, wasCorrect);
    setScore((s) => ({ right: s.right + (wasCorrect ? 1 : 0), total: s.total + 1 }));
    setIndex((i) => i + 1);
    setChoice(null);
    setTyped("");
    setBlanks([]);
    setRevealed(false);
  }

  function restart() {
    setOrder(shuffle(pool));
    setIndex(0);
    setScore({ right: 0, total: 0 });
    setChoice(null);
    setTyped("");
    setBlanks([]);
    setRevealed(false);
  }

  if (done) {
    const pct = score.total ? Math.round((score.right / score.total) * 100) : 0;
    return (
      <div className="border border-rule bg-surface p-8 text-center">
        <div className="eyebrow">Run complete</div>
        <p className="ui mt-3 text-5xl font-bold">{pct}%</p>
        <p className="mt-2 text-muted">
          {score.right} of {score.total} correct
        </p>
        <button onClick={restart} className="ui mt-6 bg-ink px-5 py-2 text-sm text-paper">
          Go again
        </button>
      </div>
    );
  }

  const fillSegments = q.type === "fill" ? (q.code ?? "").split("___") : [];

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between">
        <span className="eyebrow">
          {String(index + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")} ·{" "}
          {titles[q.concept] ?? q.concept}
        </span>
        <span className="eyebrow">
          {score.right}/{score.total}
        </span>
      </div>

      <div className="h-px w-full bg-rule">
        <div
          className="h-px bg-cobalt transition-all"
          style={{ width: `${(index / order.length) * 100}%` }}
        />
      </div>

      <div className="border border-t-0 border-rule bg-surface p-6">
        <span className="eyebrow">{
          { mcq: "Multiple choice", output: "Predict the output", flashcard: "Recall", fill: "Fill the blank" }[q.type]
        }</span>
        <h2 className="ui mt-2 text-lg font-medium">{q.prompt}</h2>

        {q.code && q.type !== "fill" && <pre className="mt-4">{q.code}</pre>}

        {/* ---- multiple choice ---- */}
        {q.type === "mcq" && (
          <ul className="mt-5 space-y-2">
            {(q.options ?? []).map((opt, i) => {
              const chosen = choice === i;
              const isAnswer = i === q.answer;
              let tone = "border-rule";
              if (revealed && isAnswer) tone = "border-[color:var(--moss)] bg-[#e8f2ea]";
              else if (revealed && chosen) tone = "border-[color:var(--oxide)] bg-[#f8e9e5]";
              else if (chosen) tone = "border-cobalt";
              return (
                <li key={i}>
                  <button
                    disabled={revealed}
                    onClick={() => setChoice(i)}
                    className={`w-full border ${tone} px-4 py-2.5 text-left text-[0.95rem]`}
                  >
                    <span className="mono mr-3 text-xs text-muted">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* ---- predict the output ---- */}
        {q.type === "output" && (
          <textarea
            value={typed}
            disabled={revealed}
            onChange={(e) => setTyped(e.target.value)}
            rows={3}
            placeholder="Type exactly what the program prints"
            className="mono mt-4 w-full border border-rule bg-white p-3 text-sm"
          />
        )}

        {/* ---- fill in the blank ---- */}
        {q.type === "fill" && (
          <pre className="mt-4 whitespace-pre-wrap">
            {fillSegments.map((seg, i) => (
              <span key={i}>
                {seg}
                {i < fillSegments.length - 1 && (
                  <input
                    value={blanks[i] ?? ""}
                    disabled={revealed}
                    onChange={(e) => {
                      const copy = [...blanks];
                      copy[i] = e.target.value;
                      setBlanks(copy);
                    }}
                    className="mono mx-1 w-32 border-b border-cobalt bg-transparent px-1 text-[#e6ecea] outline-none"
                  />
                )}
              </span>
            ))}
          </pre>
        )}

        {/* ---- flashcard ---- */}
        {q.type === "flashcard" && revealed && (
          <p className="mt-4 border-l-2 border-cobalt pl-4 leading-relaxed">{q.expected}</p>
        )}

        {/* ---- feedback ---- */}
        {revealed && q.type !== "flashcard" && (
          <div className="mt-5 border-t border-rule pt-4">
            <p className="ui text-sm font-medium" style={{ color: correct ? "var(--moss)" : "var(--oxide)" }}>
              {correct ? "Correct" : "Not quite"}
            </p>
            {!correct && (q.type === "output" || q.type === "fill") && (
              <pre className="mt-2">{q.type === "output" ? q.expected : (q.blanks ?? []).join(", ")}</pre>
            )}
            {q.explanation && <p className="mt-2 leading-relaxed">{q.explanation}</p>}
          </div>
        )}

        {/* ---- controls ---- */}
        <div className="mt-6 flex gap-3">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              disabled={q.type === "mcq" && choice === null}
              className="ui bg-ink px-5 py-2 text-sm text-paper disabled:opacity-40"
            >
              {q.type === "flashcard" ? "Show answer" : "Check"}
            </button>
          ) : q.type === "flashcard" ? (
            <>
              <button onClick={() => next(false)} className="ui border border-rule px-5 py-2 text-sm">
                Missed it
              </button>
              <button onClick={() => next(true)} className="ui bg-ink px-5 py-2 text-sm text-paper">
                Knew it
              </button>
            </>
          ) : (
            <button onClick={() => next(correct)} className="ui bg-ink px-5 py-2 text-sm text-paper">
              Next
            </button>
          )}
          <a href={`/concepts/${q.concept}`} className="ui px-2 py-2 text-sm text-muted underline">
            Read the concept
          </a>
        </div>
      </div>
    </div>
  );
}
