---
title: "Surcharge vs redéfinition"
definition: "La résolution de surcharge choisit une méthode à partir des types statiques, à la compilation. La répartition de redéfinition choisit l'implémentation à partir du type à l'exécution. Les confondre produit du code qui appelle autre chose que ce à quoi vous vous attendiez."
topic: "Méthodes"
difficulty: 3
offset: 14
tags: ["overloading", "overriding", "dispatch", "polymorphism"]
source: "ch. 6, p. 48"
---

```java
class Printer {
    void print(Object o) { System.out.println("Object"); }
    void print(String s) { System.out.println("String"); }
}

Object value = "hello";
new Printer().print(value);      // affiche "Object"
```

Le type déclaré de `value` est `Object`, et c'est tout ce que le compilateur
consulte. La surcharge est résolue statiquement ; seule la redéfinition est
dynamique.

## Ordre de résolution

Le compilateur essaie trois phases dans l'ordre, et s'arrête à la première
qui trouve une correspondance :

1. Élargissement seul — pas d'autoboxing, pas de varargs.
2. Autoboxing et unboxing autorisés.
3. Varargs autorisés.

Donc `f(int)` bat `f(Integer)` qui bat `f(int...)` pour un appel `f(1)`.
C'est pourquoi ajouter une surcharge à une API publiée est un changement
compatible au niveau source mais qui peut casser le comportement.

## Règles de redéfinition

- La liste de paramètres doit correspondre exactement ; tout le reste est une
  surcharge.
- Le type de retour peut être covariant.
- La visibilité peut s'élargir mais jamais se restreindre.
- Une exception vérifiée peut être restreinte ou supprimée mais jamais
  élargie.
- Les méthodes `static` sont masquées, pas redéfinies, et se répartissent sur
  le type statique.

Écrivez toujours `@Override`. Cela transforme une surcharge accidentelle
silencieuse en erreur de compilation.
