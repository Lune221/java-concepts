---
title: "Rétention et cibles des annotations"
definition: "@Retention détermine si une annotation survit jusqu'au fichier .class et jusqu'à l'exécution ; @Target restreint où elle peut être écrite. Seule la rétention RUNTIME est visible par réflexion."
topic: "Enums et annotations"
difficulty: 2
offset: 13
tags: ["annotations", "retention", "reflection", "meta-annotations"]
source: "ch. 5, p. 42"
---

| Politique | Conservée dans le .class | Visible par réflexion | Usage typique |
| --- | --- | --- | --- |
| `SOURCE` | non | non | `@Override`, Lombok |
| `CLASS` (par défaut) | oui | non | outils de bytecode |
| `RUNTIME` | oui | oui | Spring, JPA, Jackson |

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD, ElementType.TYPE })
@Inherited
public @interface Audited {
    String value() default "";
    Level level() default Level.INFO;
}
```

## Détails qui piègent

- `@Inherited` s'applique **uniquement** aux annotations de niveau classe, et
  seulement le long d'une chaîne de superclasses — jamais à travers les
  interfaces.
- Les éléments peuvent être des primitives, `String`, `Class`, des enums,
  d'autres annotations, ou des tableaux de ceux-ci. Rien d'autre.
- Un élément nommé `value` peut être écrit positionnellement :
  `@Audited("payment")`.

## Annotations répétables

```java
@Repeatable(Schedules.class)
public @interface Schedule { String cron(); }
```

C'est du sucre syntaxique du compilateur. Les deux occurrences sont
enveloppées dans l'annotation conteneur, donc la réflexion doit demander
`Schedules` — ou utiliser `getAnnotationsByType`, qui les déballe pour vous.
