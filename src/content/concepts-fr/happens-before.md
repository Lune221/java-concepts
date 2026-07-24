---
title: "Happens-before"
definition: "Un ordre partiel sur les opérations mémoire. Si l'action A happens-before l'action B, tout ce que A a écrit est visible pour B. Sans un tel lien, la JVM est libre de réordonner et un thread peut lire des valeurs périmées indéfiniment."
topic: "Concurrence"
difficulty: 3
offset: 19
tags: ["jmm", "memory-model", "volatile", "visibility"]
source: "ch. 9, p. 68"
---

Happens-before ne parle pas du temps. Deux actions peuvent être séparées de
plusieurs minutes d'horloge murale et n'avoir toujours aucun lien
happens-before entre elles, auquel cas la seconde peut observer une valeur
périmée pour toujours.

## D'où viennent les liens

- **Ordre du programme** — au sein d'un même thread, les instructions
  antérieures happens-before les suivantes.
- **Verrou de moniteur** — déverrouiller un moniteur happens-before tout
  verrouillage ultérieur de ce même moniteur.
- **Volatile** — une écriture sur un champ `volatile` happens-before toute
  lecture ultérieure de celui-ci.
- **Démarrage de thread** — `Thread.start()` happens-before toute action dans
  le thread démarré.
- **Jointure de thread** — toute action dans un thread happens-before le
  retour réussi d'un autre thread depuis `join()` sur celui-ci.
- **Transitivité** — si A happens-before B et B happens-before C, alors A
  happens-before C.

## L'échec classique

```java
class Stopper {
    private boolean stop = false;          // pas volatile

    void run() {
        while (!stop) { /* travail */ }    // peut hisser la lecture hors de la boucle
    }

    void requestStop() { stop = true; }    // pas de lien happens-before vers run()
}
```

Le JIT a le droit de hisser la lecture du champ hors de la boucle car rien
n'établit d'ordre. Marquer `stop` comme `volatile` crée le lien et la boucle
se termine.

## Ce que les gens comprennent mal

Supposer que `synchronized` ne concerne que l'exclusion mutuelle. Il s'agit
tout autant de visibilité — la paire relâchement/acquisition du verrou est ce
qui publie les écritures.
