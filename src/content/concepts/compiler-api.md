---
title: "The Java Compiler API"
definition: "javax.tools exposes javac as a library, so a running JVM can compile source it generated or received, then load the result."
topic: "Compiler tooling"
difficulty: 3
offset: 27
tags: ["javac", "javax-tools", "codegen", "javafileobject"]
source: "ch. 13, p. 96"
---

```java
JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<>();

StandardJavaFileManager fm =
    compiler.getStandardFileManager(diagnostics, null, null);

boolean ok = compiler.getTask(
        null, fm, diagnostics, List.of("-d", "out"), null,
        fm.getJavaFileObjectsFromFiles(List.of(new File("Main.java"))))
    .call();

for (Diagnostic<?> d : diagnostics.getDiagnostics()) {
    System.out.printf("%s:%d %s%n", d.getSource(), d.getLineNumber(),
                      d.getMessage(null));
}
```

`getSystemJavaCompiler()` returns `null` on a JRE without the compiler module —
always check.

## Compiling from memory

Subclass `SimpleJavaFileObject` to serve source from a `String`, and wrap the
file manager to collect the resulting bytes. Load them with a custom
`ClassLoader` and you have runtime code generation with no temp files.

## Why it matters here

This is exactly the mechanism the playground on this site uses. javac is
written in Java, so CheerpJ can run it inside the browser's WebAssembly JVM and
compile your code with no server involved.
