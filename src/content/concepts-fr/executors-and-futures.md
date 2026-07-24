---
title: "Executors, futures et pools de threads"
definition: "Un ExecutorService découple la soumission de tâches des threads qui les exécutent. Future est une référence vers un résultat en attente ; CompletableFuture ajoute de la composition sans bloquer."
topic: "Concurrence"
difficulty: 2
offset: 20
tags: ["executors", "futures", "thread-pools", "completablefuture"]
source: "ch. 9, p. 70"
---

Créer des threads à la main ne borne pas la concurrence. Un pool le fait, et
il permet aussi de nommer les threads, ce qui fait la différence entre un
thread dump lisible et un illisible.

```java
ExecutorService pool = Executors.newFixedThreadPool(8);
Future<Integer> f = pool.submit(() -> compute());
Integer result = f.get();          // bloque
pool.shutdown();
```

## Choisir un pool

- **Fixed** — borné, adossé à une file non bornée. Charge CPU stable.
- **Cached** — nombre de threads non borné. Correct pour des tâches I/O
  courtes, dangereux sous charge.
- **Scheduled** — exécution périodique.
- **Work-stealing / ForkJoin** — diviser-pour-régner récursif.

Pour tout ce qui touche la production, construisez directement un
`ThreadPoolExecutor` pour contrôler la borne de la file et la politique de
rejet. Une file non bornée transforme la surcharge en `OutOfMemoryError` au
lieu d'une contre-pression.

## Arrêt

`shutdown()` cesse d'accepter du travail et draine ; `shutdownNow()`
interrompt les tâches en cours et renvoie celles jamais démarrées. Les
threads de pool non-démons maintiennent la JVM en vie, donc un arrêt oublié
est un blocage.

## submit() masque les exceptions

Une exception lancée dans `submit()` est capturée dans le `Future` et
disparaît sauf si quelqu'un appelle `get()`. Avec `execute()` elle atteint le
gestionnaire d'exceptions non capturées du thread. Cette asymétrie avale
beaucoup d'erreurs.

## Composition

```java
CompletableFuture
    .supplyAsync(this::fetch, pool)
    .thenApply(this::parse)
    .exceptionally(e -> fallback())
    .thenAccept(this::store);
```
