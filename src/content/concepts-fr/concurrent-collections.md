---
title: "Collections concurrentes et wait/notify"
definition: "ConcurrentHashMap et les files bloquantes offrent un accès thread-safe sans verrou global. wait/notify est la primitive de bas niveau sous-jacente, et c'est presque toujours le mauvais outil aujourd'hui."
topic: "Concurrence"
difficulty: 2
offset: 22
tags: ["concurrenthashmap", "blockingqueue", "wait-notify", "collections"]
source: "ch. 9, p. 74"
---

`Collections.synchronizedMap` sérialise chaque opération sur un seul verrou.
`ConcurrentHashMap` verrouille par compartiment, donc les lecteurs ne bloquent
jamais et les écrivains n'entrent en contention qu'en cas de collision.

```java
ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();
counts.merge(key, 1, Integer::sum);            // atomique
counts.computeIfAbsent(key, k -> load(k));     // calculé au plus une fois
```

Les opérations composées construites à partir de `get` puis `put` ne sont
**pas** atomiques, même sur une map concurrente. Utilisez `merge`, `compute`,
`computeIfAbsent` ou `putIfAbsent`.

## Sémantique d'itération

Les collections concurrentes offrent des itérateurs faiblement cohérents :
elles ne lancent jamais `ConcurrentModificationException` et peuvent
refléter ou non les mises à jour concurrentes. `CopyOnWriteArrayList` prend un
instantané à l'itération — idéal pour les listes d'écouteurs, désastreux pour
des données à forte écriture.

## Producteur/consommateur

```java
BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);
queue.put(task);          // bloque quand pleine — contre-pression gratuite
Task t = queue.take();    // bloque quand vide
```

## wait/notify, si vraiment nécessaire

```java
synchronized (lock) {
    while (!condition) {      // toujours une boucle, jamais un if
        lock.wait();          // les réveils intempestifs sont permis
    }
}
```

N'appelez cela qu'en détenant le moniteur, revérifiez toujours le prédicat
dans une boucle, et préférez `notifyAll` — `notify` réveille un seul attendeur
arbitraire et peut en laisser d'autres bloqués. Dans du code neuf, préférez
une `BlockingQueue`, un `CountDownLatch` ou un `Semaphore`.
