---
title: "Method handles"
definition: "Une référence typée et directement exécutable vers une méthode, résolue une fois via un Lookup qui capture les droits d'accès de l'appelant. Plus rapide que la réflexion et à la base d'invokedynamic."
topic: "Réflexion"
difficulty: 3
offset: 25
tags: ["method-handles", "invokedynamic", "lambda", "performance"]
source: "ch. 11, p. 88"
---

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, int.class, int.class);
MethodHandle mh = lookup.findVirtual(String.class, "substring", type);

String s = (String) mh.invokeExact("hello world", 0, 5);
```

## Face à la réflexion

- L'accès est vérifié une fois, à la recherche du handle, pas à chaque appel.
- Le handle porte un `MethodType` exact, donc le JIT peut inliner à travers
  lui.
- Les arguments ne sont pas emballés dans un tableau.
- Il peut être transformé : `bindTo`, `asType`, `insertArguments`,
  `filterArguments` construisent de nouveaux handles à partir d'existants.

## invokeExact vs invoke

`invokeExact` exige que la signature statique du site d'appel corresponde au
type du handle caractère pour caractère — y compris le cast sur la valeur de
retour. `invoke` insère les conversions pour vous et coûte un peu plus cher.
Un `WrongMethodTypeException` venant de `invokeExact` signifie presque
toujours un cast manquant.

## Où vous l'avez déjà utilisé

Chaque lambda que vous écrivez compile vers une instruction `invokedynamic`
dont la méthode bootstrap construit un `MethodHandle`. C'est pourquoi les
lambdas ne génèrent pas un fichier de classe par lambda comme le font les
classes anonymes.
