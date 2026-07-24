---
title: "Immutable classes"
definition: "An object whose observable state cannot change after construction. Immutable objects are automatically thread-safe, freely shareable, and safe as map keys."
topic: "Class design"
difficulty: 2
offset: 8
tags: ["immutability", "thread-safety", "final", "records"]
source: "ch. 3, p. 20"
---

The recipe:

- Make the class `final`, or all constructors private, so behaviour cannot be
  overridden.
- Make every field `private final`.
- Provide no mutators.
- Defensively copy any mutable component on the way in and on the way out.

```java
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;

    public Money(BigDecimal amount, Currency currency) {
        this.amount = Objects.requireNonNull(amount);
        this.currency = Objects.requireNonNull(currency);
    }

    public Money plus(Money other) {          // returns a new instance
        if (!currency.equals(other.currency))
            throw new IllegalArgumentException("currency mismatch");
        return new Money(amount.add(other.amount), currency);
    }
}
```

## The final-field guarantee

The memory model gives a special promise: once a constructor completes without
letting `this` escape, every thread sees the correctly initialised values of
its `final` fields, with no synchronisation at all. Let `this` escape from the
constructor and the guarantee is void.

## Cost

Every modification allocates. That is usually irrelevant, and where it is not,
the pattern is a mutable builder producing an immutable result — `String` and
`StringBuilder` being the canonical pair.
