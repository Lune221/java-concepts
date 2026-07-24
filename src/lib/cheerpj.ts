/**
 * CheerpJ bridge — compiles and runs Java entirely in the browser.
 *
 * How it works: CheerpJ ships a full OpenJDK compiled to WebAssembly. Because
 * javac is itself written in Java, we run the compiler *inside* the browser
 * JVM, then run the class it produced. No server, no API key, no backend.
 *
 * Virtual filesystem mounts used below:
 *   /app/    -> the root of the web server this page was served from
 *   /str/    -> in-memory files created with cheerpOSAddStringFile
 *   /files/  -> writable, backed by IndexedDB
 */

const RUNTIME = "https://cjrtnc.leaningtech.com/4.3/loader.js";

/**
 * Classpath handed to javac. If compilation fails with a ClassNotFound on
 * com.sun.tools.javac.Main, this is the line to adjust — cross-check against
 * the JavaFiddle source (github.com/leaningtech/javafiddle, Apache-2.0),
 * which is the reference implementation of this exact technique.
 */
const JAVAC_CLASSPATH = "/app/";

declare global {
  interface Window {
    cheerpjInit: (opts?: Record<string, unknown>) => Promise<void>;
    cheerpjRunMain: (cls: string, cp: string, ...args: string[]) => Promise<number>;
    cheerpOSAddStringFile: (path: string, data: string) => void;
  }
}

let bootstrap: Promise<void> | null = null;

/** Loads and initialises the runtime once, no matter how many callers. */
export function initCheerpJ(): Promise<void> {
  if (bootstrap) return bootstrap;

  bootstrap = new Promise<void>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = RUNTIME;
    tag.async = true;
    tag.onload = async () => {
      try {
        await window.cheerpjInit();
        resolve();
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    };
    tag.onerror = () =>
      reject(new Error("The Java runtime could not be downloaded. Check your connection and reload."));
    document.head.appendChild(tag);
  });

  return bootstrap;
}

/**
 * Java's stdout and stderr surface through the browser console, so we tap it
 * for the duration of a run and hand back what was written.
 */
function captureConsole(): { lines: string[]; release: () => void } {
  const lines: string[] = [];
  const original = { log: console.log, warn: console.warn, error: console.error };

  const tap =
    (fallback: (...a: unknown[]) => void) =>
    (...args: unknown[]) => {
      lines.push(args.map((a) => (typeof a === "string" ? a : String(a))).join(" "));
      fallback.apply(console, args as []);
    };

  console.log = tap(original.log);
  console.warn = tap(original.warn);
  console.error = tap(original.error);

  return {
    lines,
    release: () => {
      console.log = original.log;
      console.warn = original.warn;
      console.error = original.error;
    },
  };
}

/** Pulls the public class name out of a source file, defaulting to Main. */
export function detectMainClass(source: string): string {
  const match = source.match(/(?:public\s+)?(?:final\s+)?class\s+([A-Za-z_$][\w$]*)/);
  return match ? match[1] : "Main";
}

export type RunResult = {
  ok: boolean;
  /** Compiler diagnostics, present when ok is false. */
  diagnostics: string;
  /** Whatever the program wrote to stdout/stderr. */
  output: string;
};

/** Compiles the source, then runs it. Both steps happen in the browser. */
export async function compileAndRun(source: string): Promise<RunResult> {
  await initCheerpJ();

  const mainClass = detectMainClass(source);
  const path = `/str/${mainClass}.java`;
  window.cheerpOSAddStringFile(path, source);

  const compile = captureConsole();
  let exitCode: number;
  try {
    exitCode = await window.cheerpjRunMain(
      "com.sun.tools.javac.Main",
      JAVAC_CLASSPATH,
      "-d",
      "/files/",
      path
    );
  } finally {
    compile.release();
  }

  if (exitCode !== 0) {
    return {
      ok: false,
      diagnostics: compile.lines.join("\n") || "Compilation failed.",
      output: "",
    };
  }

  const run = captureConsole();
  try {
    await window.cheerpjRunMain(mainClass, "/files/");
  } catch (err) {
    run.lines.push(String(err));
  } finally {
    run.release();
  }

  return { ok: true, diagnostics: "", output: run.lines.join("\n") };
}
