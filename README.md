# Advanced Java — concepts, quiz, playground

A fully static study site. 29 concepts, 60 questions, and a Java playground that
compiles and runs code in the browser. No backend, no database, no API keys.

```
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/
```


## Deploying to Cloudflare Pages

Connect the repository and set:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |

Or from the CLI: `npx wrangler pages deploy dist`.

`public/_headers` is copied into `dist` and picked up automatically.

## How the playground works

CheerpJ is a full OpenJDK compiled to WebAssembly. Because javac is itself
written in Java, `src/lib/cheerpj.ts` runs the compiler *inside* the browser
JVM, writes your source into the virtual filesystem, compiles it, and runs the
resulting class. Everything stays on the user's machine.

**The one line to verify.** `JAVAC_CLASSPATH` in `src/lib/cheerpj.ts` is the
classpath handed to javac: `/app/tools.jar:/files/`. `tools.jar` is what
actually contains `com.sun.tools.javac.Main`; a `postinstall` script
(`scripts/fetch-tools-jar.mjs`) downloads it into `public/` (gitignored, ~17MB)
so it's served from the site root and reachable at `/app/tools.jar`. If
compilation fails with a ClassNotFound on `com.sun.tools.javac.Main`, check
that the download ran, and cross-check the classpath against the reference
implementation: [leaningtech/javafiddle](https://github.com/leaningtech/javafiddle)
(Apache-2.0), which does exactly this.

**Licensing.** CheerpJ is free for personal projects and technical evaluation.
Check the terms before shipping it inside a commercial product.

**First load** pulls tens of megabytes of runtime, then caches. The island warms
the JVM on mount so the first Run does not pay the whole cost.

## Adding content

A concept is one markdown file in `src/content/concepts/`. The schema in
`src/content.config.ts` validates it at build time, so a malformed entry fails
the build rather than the page.

```yaml
---
title: "Sealed classes"
definition: "One sentence a reader could repeat back."
topic: "Class design"        # groups on the index page
difficulty: 2                # 1-3, renders as dots
offset: 30                   # unique; drives the listing gutter
tags: ["sealed", "pattern-matching"]
source: "ch. 3, p. 22"       # traceability back to the book
---
```

Questions live in `src/data/questions.json`. Four shapes:

```jsonc
{ "type": "mcq",       "options": [...], "answer": 2 }
{ "type": "output",    "code": "...",    "expected": "false\ntrue" }
{ "type": "flashcard", "prompt": "...",  "expected": "..." }        // self-scored
{ "type": "fill",      "code": "a ___ b", "blanks": ["volatile"] }  // ___ per blank
```

Every `concept` value must match a concept filename. `npm run build` will not
catch a mismatch, so run `node scripts/check-content.mjs` before committing.

## Progress

Scores are kept in `localStorage` under `java-concepts:progress:v1`. No account,
nothing leaves the browser, and it survives a refresh.

## Source material

Concept selection and chapter ordering follow *Advanced Java* by Andriy Redko
(Java Code Geeks, 2015). That book is copyrighted: the `source` field points
back to it for your own reference, but every definition, example and question
here is written independently. Do not paste the book's prose into these files if
the site is going to be public.
