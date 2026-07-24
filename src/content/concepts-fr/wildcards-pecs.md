---
title: "Wildcards et PECS"
definition: "? extends T donne un producteur que l'on peut seulement lire ; ? super T donne un consommateur dans lequel on peut seulement écrire. Producer Extends, Consumer Super."
topic: "Génériques"
difficulty: 3
offset: 11
tags: ["generics", "wildcards", "variance", "pecs"]
source: "ch. 4, p. 31"
---

Les génériques sont invariants : `List<String>` n'est pas un `List<Object>`.
Les wildcards réintroduisent la variance dont vous avez réellement besoin,
une direction à la fois.

```java
void copy(List<? extends Number> src, List<? super Number> dst) {
    for (Number n : src) {   // lire depuis src est sûr
        dst.add(n);          // écrire dans dst est sûr
    }
}
```

- Depuis `List<? extends Number>` vous pouvez lire un `Number`, mais vous ne
  pouvez rien ajouter — la liste réelle pourrait être un `List<Integer>`.
- Vers `List<? super Number>` vous pouvez ajouter n'importe quel `Number`,
  mais une lecture ne renvoie qu'un `Object`.

`Collections.copy` et `Stream.map` sont tous deux écrits ainsi.

## Le wildcard non borné

`List<?>` accepte n'importe quelle paramétrisation mais n'autorise aucun
ajout à part `null`. Ce n'est pas la même chose que le type brut `List`, qui
désactive complètement la vérification générique et produit des
avertissements non vérifiés.

## Capture

```java
void reverse(List<?> list) { doReverse(list); }
private <T> void doReverse(List<T> list) { /* T est maintenant nommable */ }
```

La méthode auxiliaire donne un nom au type capturé anonyme, ce qui est la
façon standard de contourner « impossible d'ajouter à un `List<?>` ».
