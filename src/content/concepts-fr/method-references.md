---
title: "Références de méthode"
definition: "Une lambda compacte qui se contente d'appeler une méthode existante. Quatre formes : statique, instance liée, instance non liée, et constructeur."
topic: "Méthodes"
difficulty: 1
offset: 15
tags: ["method-references", "lambda", "streams", "java8"]
source: "ch. 6, p. 50"
---

```java
Function<String, Integer> parse   = Integer::parseInt;      // statique
Supplier<Integer>         size    = list::size;             // instance liée
Function<String, Integer> length  = String::length;         // instance non liée
Supplier<List<String>>    factory = ArrayList::new;         // constructeur
```

La forme non liée est celle qui surprend le plus : `String::length` devient
une fonction à un argument dont l'argument *est* le récepteur.

## Les références liées capturent avidement

```java
List<String> list = new ArrayList<>();
Supplier<Integer> s = list::size;
list = new ArrayList<>(List.of("a"));
s.get();   // 0 — liée à l'objet original, pas à la variable
```

Le récepteur est évalué au moment où la référence est créée. Une lambda
`() -> list.size()` ne compilerait pas ici, puisque `list` n'est pas
effectivement finale.

## Ambiguïté

`Integer::parseInt` pourrait cibler `Function<String,Integer>` ou
`ToIntFunction<String>` ; le type cible décide. Quand les deux sont
plausibles dans le contexte, le compilateur signale une ambiguïté et une
lambda explicite la résout.
