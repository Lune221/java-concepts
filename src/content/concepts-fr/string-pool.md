---
title: "Le pool de constantes de chaînes"
definition: "Les littéraux String sont internés dans un pool à l'échelle de la JVM, donc des littéraux identiques sont le même objet. Les chaînes construites à l'exécution ne sont pas mises en pool sauf appel explicite à intern()."
topic: "Bonnes pratiques générales"
difficulty: 1
offset: 6
tags: ["strings", "identity", "jvm"]
source: "ch. 7, p. 58"
---

```java
String a = "java";
String b = "java";
String c = new String("java");
String d = c.intern();

a == b;   // true  — même littéral mis en pool
a == c;   // false — new String() alloue toujours
a == d;   // true  — intern() renvoie l'instance mise en pool
```

Les expressions constantes sont repliées à la compilation, donc `"ja" + "va"`
est aussi mise en pool et `== "java"` est vrai. La concaténation impliquant
une variable non finale se produit à l'exécution et ne l'est pas.

## Pourquoi c'est important

La comparaison d'identité sur des chaînes est un bug qui passe ses propres
tests unitaires, parce que les données de test sont généralement des
littéraux. Comparez toujours avec `equals`.
