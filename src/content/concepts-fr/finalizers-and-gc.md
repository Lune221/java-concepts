---
title: "Ramasse-miettes et finaliseurs"
definition: "Le collecteur récupère les objets inatteignables depuis toute racine GC, selon un calendrier sur lequel on ne peut pas compter. finalize() est dépréciée et inutilisable pour libérer des ressources ; Cleaner ou try-with-resources est la réponse."
topic: "Cycle de vie des objets"
difficulty: 2
offset: 2
tags: ["gc", "finalize", "resources", "cleaner"]
source: "ch. 1, p. 4"
---

L'atteignabilité, pas la portée, décide de la collecte. Un objet devient
collectable dès qu'aucune chaîne de références ne l'atteint depuis une racine
GC — la pile d'un thread vivant, un champ statique, ou une référence JNI.

## Pourquoi finalize() échoue

- Elle peut ne jamais s'exécuter. La JVM a le droit de se terminer sans rien
  finaliser.
- Elle s'exécute sur un thread non spécifié à un moment non spécifié.
- Elle coûte au moins deux cycles de GC, car un objet finalisable doit
  survivre à une collecte pour être finalisé et à une autre pour être libéré.
- Ressusciter `this` à l'intérieur est légal, ce qui rend toute la conception
  malsaine.

```java
// Le remplacement
class Handle implements AutoCloseable {
    @Override public void close() { /* libération ici */ }
}

try (Handle h = new Handle()) {
    // libération déterministe à la fin du bloc
}
```

## Types de référence, du plus faible au plus fort

`SoftReference` est effacée sous pression mémoire, `WeakReference` à la
prochaine collecte, `PhantomReference` seulement après que l'objet a été
finalisé — cette dernière étant la base de `Cleaner`, le point d'ancrage
post-mortem officiel.
