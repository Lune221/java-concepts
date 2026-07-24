---
title: "try-with-resources et exceptions supprimées"
definition: "Toute AutoCloseable déclarée dans l'en-tête du try est fermée automatiquement, dans l'ordre inverse, même en cas d'exception — et un échec pendant la fermeture est attaché à l'exception primaire plutôt que de la remplacer."
topic: "Exceptions"
difficulty: 2
offset: 18
tags: ["resources", "autocloseable", "suppressed", "finally"]
source: "ch. 8, p. 63"
---

```java
try (InputStream in = Files.newInputStream(src);
     OutputStream out = Files.newOutputStream(dst)) {
    in.transferTo(out);
}   // out fermé en premier, puis in — les deux garantis
```

## Ce que l'ancienne forme faisait mal

```java
InputStream in = null;
try {
    in = Files.newInputStream(src);
    read(in);                       // lance IOException  <- la vraie cause
} finally {
    if (in != null) in.close();     // lance aussi          <- celle-ci gagne
}
```

L'exception de `close()` remplace celle qui vous intéressait.
`try-with-resources` garde la première et enregistre la seconde :

```java
catch (IOException e) {
    for (Throwable s : e.getSuppressed()) { /* l'échec de fermeture */ }
}
```

## Détails

- Les ressources doivent être effectivement finales ; depuis Java 9, une
  variable finale existante peut être nommée directement dans l'en-tête.
- `close()` devrait être idempotente, car rien n'empêche un second appel.
- Un bloc `finally` s'exécute quand même après la fermeture de toutes les
  ressources, si vous en avez besoin d'un.
