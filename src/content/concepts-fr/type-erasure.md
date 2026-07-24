---
title: "Effacement de type"
definition: "Les arguments de type générique n'existent qu'à la compilation. Le compilateur les vérifie, puis les efface vers leurs bornes et insère des casts, si bien que le bytecode ne conserve aucune trace de la paramétrisation."
topic: "Génériques"
difficulty: 2
offset: 10
tags: ["generics", "bytecode", "reflection"]
source: "ch. 4, p. 30"
---

`List<String>` et `List<Integer>` compilent vers la même classe. Les
chevrons sont une obligation de preuve acquittée à la compilation, pas une
propriété d'exécution.

## Conséquences que vous rencontrez vraiment

- `new T[10]` ne compile pas — le type de composant à l'exécution du tableau
  est inconnu.
- `instanceof List<String>` ne compile pas ; seul `instanceof List<?>` le
  fait.
- Deux méthodes qui ne diffèrent que par leur paramètre générique entrent en
  collision après effacement.

```java
void f(List<String> a) {}
void f(List<Integer> a) {}   // collision de nom : même effacement
```

## L'échappatoire

L'effacement n'est pas total : les signatures génériques sont conservées dans
un attribut séparé du fichier de classe pour la réflexion et pour le
compilateur lisant une bibliothèque. `Class.getGenericSuperclass()` la lit,
ce qui est comment fonctionne l'astuce du super-type-token.

```java
abstract class TypeRef<T> {
    final Type type = ((ParameterizedType) getClass()
        .getGenericSuperclass()).getActualTypeArguments()[0];
}
Type t = new TypeRef<List<String>>() {}.type;   // List<String>
```
