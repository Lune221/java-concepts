---
title: "L'API du compilateur Java"
definition: "javax.tools expose javac en tant que bibliothèque, donc une JVM en cours d'exécution peut compiler du source qu'elle a généré ou reçu, puis charger le résultat."
topic: "Outillage du compilateur"
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

`getSystemJavaCompiler()` renvoie `null` sur un JRE sans le module compilateur
— vérifiez toujours.

## Compiler depuis la mémoire

Sous-classez `SimpleJavaFileObject` pour servir le source depuis une
`String`, et enveloppez le gestionnaire de fichiers pour collecter les octets
résultants. Chargez-les avec un `ClassLoader` personnalisé et vous obtenez de
la génération de code à l'exécution sans aucun fichier temporaire.

## Pourquoi c'est important ici

C'est exactement le mécanisme qu'utilise le bac à sable de ce site. javac est
lui-même écrit en Java, donc CheerpJ peut l'exécuter dans la JVM WebAssembly
du navigateur et compiler votre code sans aucun serveur impliqué.
