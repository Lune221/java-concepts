---
title: "Annotation retention and targets"
definition: "@Retention decides whether an annotation survives to the class file and to runtime; @Target restricts where it may be written. Only RUNTIME retention is visible to reflection."
topic: "Enums and annotations"
difficulty: 2
offset: 13
tags: ["annotations", "retention", "reflection", "meta-annotations"]
source: "ch. 5, p. 42"
---

| Policy | Kept in .class | Visible to reflection | Typical use |
| --- | --- | --- | --- |
| `SOURCE` | no | no | `@Override`, Lombok |
| `CLASS` (default) | yes | no | bytecode tools |
| `RUNTIME` | yes | yes | Spring, JPA, Jackson |

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.METHOD, ElementType.TYPE })
@Inherited
public @interface Audited {
    String value() default "";
    Level level() default Level.INFO;
}
```

## Details that catch people out

- `@Inherited` applies **only** to class-level annotations, and only down a
  superclass chain — never through interfaces.
- Elements may be primitives, `String`, `Class`, enums, other annotations, or
  arrays of these. Nothing else.
- An element named `value` can be written positionally: `@Audited("payment")`.

## Repeatable annotations

```java
@Repeatable(Schedules.class)
public @interface Schedule { String cron(); }
```

This is compiler sugar. The two occurrences are wrapped in the container
annotation, so reflection must ask for `Schedules` — or use
`getAnnotationsByType`, which unwraps it for you.
