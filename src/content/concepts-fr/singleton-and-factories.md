---
title: "Motifs de construction"
definition: "Des façons de contrôler l'instanciation : un singleton garantit une seule instance, une fabrique statique nomme et met en cache la construction, et l'injection de dépendances fournit les collaborateurs plutôt que de laisser un objet les construire lui-même."
topic: "Cycle de vie des objets"
difficulty: 1
offset: 3
tags: ["singleton", "factory", "di", "patterns"]
source: "ch. 1, p. 5"
---

## Singleton, fait correctement

Un enum est la seule forme qui soit thread-safe, initialisée paresseusement
par la JVM, et immunisée contre les attaques par réflexion comme par
désérialisation.

```java
public enum Registry {
    INSTANCE;
    public void register(String key) { /* ... */ }
}
```

La version à verrouillage double vérification a besoin de `volatile` sur le
champ pour être correcte, et ne vaut la peine d'être écrite que quand
l'instance doit vraiment être paresseuse.

## Fabrique statique plutôt que constructeur

Une méthode de fabrique a un nom, n'est pas obligée de renvoyer une nouvelle
instance, et peut renvoyer un sous-type. `List.of()`, `Optional.empty()` et
`Integer.valueOf()` exploitent tous au moins l'un de ces avantages.

## Injection de dépendances

Un objet qui construit lui-même ses collaborateurs ne peut pas être testé
isolément. Les recevoir en paramètres du constructeur rend la dépendance
explicite et permet à l'appelant de substituer un faux.
