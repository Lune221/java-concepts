---
title: "Construction et ordre d'initialisation"
definition: "Créer une instance exécute une séquence fixe : les initialiseurs de champs et les blocs d'instance dans l'ordre du source, puis le corps du constructeur — et la superclasse termine tout cela avant que la sous-classe ne commence."
topic: "Cycle de vie des objets"
difficulty: 2
offset: 1
tags: ["constructors", "initialisation", "inheritance"]
source: "ch. 1, p. 1"
---

L'ordre est fixe et mérite d'être mémorisé, car un nombre surprenant de bugs
d'initialisation ne sont que cette séquence mal lue.

1. Les champs statiques et blocs statiques, une fois, à la première
   initialisation de la classe.
2. L'initialisation d'instance de la superclasse, en entier.
3. Les initialiseurs de champs d'instance et les blocs d'instance, dans
   l'ordre du source.
4. Le corps du constructeur.

## Le piège : appeler une méthode redéfinissable depuis un constructeur

```java
class Base {
    Base() { init(); }              // s'exécute avant que les champs de Derived n'existent
    void init() {}
}

class Derived extends Base {
    private final List<String> items = new ArrayList<>();

    @Override void init() { items.add("x"); }   // NullPointerException
}
```

L'étape 2 se termine avant l'étape 3, donc `items` est encore `null` quand le
`init()` redéfini s'exécute. Les constructeurs ne devraient appeler que des
méthodes `private`, `static` ou `final`.

## Garantie de construction

Un constructeur qui lance une exception ne laisse aucune référence utilisable
derrière lui — l'objet n'est jamais publié. C'est ce qui rend la validation
dans le constructeur fiable, et pourquoi un champ `final` assigné une seule
fois dans le constructeur est sûr à publier entre threads.
