---
title: "Enums as special classes"
definition: "An enum constant is a singleton instance of a compiler-generated final class. Enums can carry fields, implement interfaces, and give each constant its own method body."
topic: "Enums and annotations"
difficulty: 2
offset: 12
tags: ["enums", "enumset", "singleton"]
source: "ch. 5, p. 36"
---

```java
public enum Operation {
    PLUS("+")  { public int apply(int a, int b) { return a + b; } },
    TIMES("*") { public int apply(int a, int b) { return a * b; } };

    private final String symbol;

    Operation(String symbol) { this.symbol = symbol; }

    public abstract int apply(int a, int b);

    public String symbol() { return symbol; }
}
```

Constant-specific bodies compile to anonymous subclasses, which is why
`getClass()` on `PLUS` is not `Operation.class` — use `getDeclaringClass()`
when you need the enum type itself.

## EnumSet and EnumMap

Both exploit the fact that the constant set is known and ordinal-indexed.
`EnumSet` is a bit vector, `EnumMap` a plain array — dramatically smaller and
faster than the hash-based equivalents, and iteration follows declaration
order.

```java
EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
```

## Ordinal is a trap

`ordinal()` changes the moment someone reorders the declarations. Never
persist it and never key business logic on it — store the `name()` or an
explicit field instead.
