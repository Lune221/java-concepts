---
title: "Boxing, unboxing et le cache Integer"
definition: "L'autoboxing convertit silencieusement entre primitives et wrappers. Les valeurs de -128 à 127 proviennent d'un cache partagé, donc == semble fonctionner sur les petits nombres et échoue sur les grands."
topic: "Bonnes pratiques générales"
difficulty: 2
offset: 16
tags: ["autoboxing", "integer-cache", "identity", "npe"]
source: "ch. 7, p. 57"
---

```java
Integer a = 127, b = 127;
Integer c = 128, d = 128;

a == b;   // true  — les deux viennent du cache
c == d;   // false — deux objets distincts
```

`Integer.valueOf` met en cache −128…127 par spécification. `Boolean`,
`Byte`, `Character` jusqu'à 127, `Short` et `Long` sont aussi mis en cache ;
`Float` et `Double` jamais.

## Les trois vrais dangers

**Unboxing d'un null.** `map.get(missingKey)` renvoie `null`, et l'affecter à
un `int` lance `NullPointerException` sur une ligne qui ne contient aucun
appel de méthode visible.

```java
Map<String, Integer> counts = new HashMap<>();
int n = counts.get("absent");        // NPE
```

**Comparaison mixte.** `Integer == int` déballe et compare numériquement ;
`Integer == Integer` compare des références. Un seul caractère change le
sens.

**Allocation silencieuse dans les boucles.** Un accumulateur `Long` dans une
boucle serrée s'emballe à chaque itération. Déclarez les accumulateurs comme
des primitives.

## Règle

Utilisez des primitives sauf si vous avez besoin de `null`, d'un élément de
collection, ou d'un argument de type générique. Comparez les wrappers avec
`equals`, ou appelez d'abord `intValue()`.
