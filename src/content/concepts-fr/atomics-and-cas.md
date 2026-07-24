---
title: "Variables atomiques et compare-and-swap"
definition: "Les classes atomiques utilisent une instruction matérielle de comparaison-échange pour mettre à jour une valeur sans verrou : lire, calculer, puis échanger seulement si rien n'a changé entre-temps."
topic: "Concurrence"
difficulty: 3
offset: 21
tags: ["atomic", "cas", "lock-free", "concurrency"]
source: "ch. 9, p. 73"
---

`count++` est trois opérations — lire, ajouter, écrire — et deux threads
peuvent s'entrelacer à l'intérieur. `AtomicInteger` rend toute la mise à jour
indivisible.

```java
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();

// Mise à jour atomique arbitraire, retentée jusqu'à ce qu'elle gagne la course
counter.updateAndGet(v -> Math.min(v + 1, MAX));
```

La boucle de réessai est le point clé : le CAS échoue quand un autre thread
est arrivé le premier, et l'opération réessaie simplement avec la nouvelle
valeur. Aucun thread ne se bloque jamais, ce qui explique pourquoi les
atomiques surpassent les verrous sous contention modérée — et pourquoi ils se
dégradent sous forte contention, quand les réessais s'accumulent. `LongAdder`
existe pour ce cas, en répartissant les mises à jour sur plusieurs cellules et
en sommant à la lecture.

## Une seule variable à la fois

Le CAS ne couvre qu'une seule variable. Deux champs qui doivent changer
ensemble ont toujours besoin d'un verrou ou d'un objet immuable échangé
atomiquement avec `AtomicReference`.

## Le problème ABA

Une valeur peut passer de A à B puis revenir à A entre votre lecture et votre
échange ; le CAS n'y voit aucune différence. `AtomicStampedReference` attache
un compteur de version quand cela compte.

## volatile ne suffit pas

`volatile` garantit la visibilité et l'ordre, pas l'atomicité. Un `volatile
int` perd toujours des incréments.
