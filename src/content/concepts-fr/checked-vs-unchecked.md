---
title: "Exceptions vérifiées vs non vérifiées"
definition: "Les exceptions vérifiées héritent d'Exception et doivent être déclarées ou gérées ; les non vérifiées héritent de RuntimeException et n'ont besoin ni de l'un ni de l'autre. La distinction porte sur la capacité réaliste de l'appelant à récupérer."
topic: "Exceptions"
difficulty: 2
offset: 17
tags: ["exceptions", "checked", "runtime", "api-design"]
source: "ch. 8, p. 62"
---

```
Throwable
├── Error              non vérifiée — ne pas attraper (OutOfMemoryError, StackOverflowError)
└── Exception          vérifiée
    └── RuntimeException  non vérifiée (NPE, IllegalArgument, IllegalState)
```

Utilisez une exception vérifiée quand l'appelant dispose d'une action de
récupération réaliste — réessayer, se rabattre sur autre chose, redemander.
Utilisez une exception non vérifiée pour les erreurs de programmation et les
préconditions violées, pour lesquelles l'appelant ne peut rien faire à
l'exécution.

## À ne jamais faire

```java
try { risky(); } catch (Exception e) { }          // avalée
try { risky(); } catch (Exception e) { throw new RuntimeException(e); }  // sans contexte
```

Un bloc catch vide efface les preuves. Si vous devez continuer, journalisez
avec la cause et expliquez pourquoi.

## Préserver la cause

```java
catch (SQLException e) {
    throw new AccountLookupException("account " + id, e);   // cause chaînée
}
```

Perdre la cause est la raison la plus fréquente pour laquelle une pile
d'appels en production ne vous dit rien.

## Les lambdas rendent les exceptions vérifiées maladroites

`Function.apply` ne déclare aucune exception vérifiée, donc le corps d'une
lambda ne peut pas en lancer une. Les réponses habituelles sont un wrapper qui
convertit vers du non vérifié, ou une interface fonctionnelle personnalisée
qui déclare `throws E`.
