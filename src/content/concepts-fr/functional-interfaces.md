---
title: "Interfaces fonctionnelles, méthodes default et static"
definition: "Une interface avec exactement une méthode abstraite peut être implémentée par une lambda. Les méthodes default permettent aux interfaces de gagner du comportement sans casser leurs implémenteurs, ce qui est comment Java a rétrofitté les streams sur Collection."
topic: "Conception des classes"
difficulty: 2
offset: 7
tags: ["lambda", "default-methods", "interfaces", "java8"]
source: "ch. 3, p. 19"
---

`@FunctionalInterface` est optionnelle mais utile à appliquer — elle force le
compilateur à rejeter une seconde méthode abstraite, transformant une rupture
d'API accidentelle en échec de build.

```java
@FunctionalInterface
interface Validator<T> {
    boolean test(T value);

    default Validator<T> and(Validator<T> other) {
        return v -> this.test(v) && other.test(v);
    }

    static <T> Validator<T> always() { return v -> true; }
}
```

Les méthodes héritées d'`Object` ne comptent pas dans la règle de la
méthode-abstraite-unique, ce qui explique pourquoi `Comparator` peut déclarer
`equals` et rester fonctionnelle.

## Le diamant, résolu

Si deux interfaces fournissent la même méthode default, la classe qui
implémente doit la redéfinir et la désambiguïser explicitement :

```java
class C implements A, B {
    @Override public void hello() { A.super.hello(); }
}
```

Les implémentations de classe l'emportent toujours sur les défauts
d'interface, et une interface plus spécifique l'emporte sur une moins
spécifique.

## Méthodes statiques sur les interfaces

Elles ne sont pas héritées. `Validator.always()` n'est accessible que par le
nom de l'interface, ce qui garde les méthodes utilitaires à côté du type
qu'elles servent plutôt que dans une classe utilitaire `Validators` séparée.
