import { useCallback, useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { compileAndRun, initCheerpJ } from "../lib/cheerpj";
import { t, type Lang } from "../lib/i18n";

const STARTER = `public class Main {
    public static void main(String[] args) {
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;

        System.out.println(a == b);
        System.out.println(c == d);
    }
}
`;

type Phase = "cold" | "loading" | "ready" | "running";

type Props = { initial?: string; lang?: Lang };

export default function Playground({ initial = STARTER, lang = "en" }: Props) {
  const s = t(lang).playground;
  const [source, setSource] = useState(initial);
  const [phase, setPhase] = useState<Phase>("cold");
  const [output, setOutput] = useState("");
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  // Warm the runtime as soon as the island mounts — it is a large download and
  // the first run should not pay for all of it.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    setPhase("loading");
    initCheerpJ()
      .then(() => setPhase("ready"))
      .catch((e: Error) => {
        setFailed(true);
        setOutput(e.message);
        setPhase("cold");
      });
  }, []);

  const run = useCallback(async () => {
    setPhase("running");
    setFailed(false);
    setOutput("");
    try {
      const result = await compileAndRun(source);
      setFailed(!result.ok);
      setOutput(result.ok ? result.output || s.noOutput : result.diagnostics);
    } catch (e) {
      setFailed(true);
      setOutput(e instanceof Error ? e.message : String(e));
    } finally {
      setPhase("ready");
    }
  }, [source]);

  const busy = phase === "loading" || phase === "running";
  const label = phase === "loading" ? s.starting : phase === "running" ? s.running : s.run;

  return (
    <div className="border border-rule bg-surface">
      <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
        <span className="eyebrow">{s.fileLabel}</span>
        <button
          onClick={run}
          disabled={busy}
          className="ui bg-ink px-4 py-1.5 text-sm font-medium text-paper disabled:opacity-40"
        >
          {label}
        </button>
      </div>

      <CodeMirror
        value={source}
        height="340px"
        extensions={[java()]}
        onChange={setSource}
        basicSetup={{ lineNumbers: true, foldGutter: false }}
      />

      <div className="border-t border-rule px-4 py-3">
        <div className="eyebrow mb-1.5">{failed ? s.compilerOutput : s.output}</div>
        <pre
          className="max-h-56 overflow-auto text-xs"
          style={failed ? { background: "#2a1512", color: "#ffcfc4" } : undefined}
        >
          {output || (phase === "loading" ? s.downloading : s.pressRun)}
        </pre>
      </div>
    </div>
  );
}
