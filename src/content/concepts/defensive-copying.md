---
title: "clone, copying and defensive copies"
definition: "Object.clone() produces a shallow copy through a broken protocol. A copy constructor or static factory is clearer, and mutable fields crossing an API boundary need copying in both directions."
topic: "Object methods"
difficulty: 2
offset: 5
tags: ["clone", "copy", "immutability", "encapsulation"]
source: "ch. 2, p. 14"
---

`Cloneable` is a marker interface that does not declare `clone()`, and
`Object.clone()` is `protected` and throws unless the marker is present. The
result is a shallow copy: nested mutable objects stay shared.

```java
// Prefer this
public Period(Period other) {
    this.start = new Date(other.start.getTime());
    this.end   = new Date(other.end.getTime());
}
```

## Defensive copying, in and out

A constructor that stores a caller's mutable argument by reference has handed
that caller a way to mutate the object afterwards. A getter that returns the
internal reference does the same in the other direction.

```java
public final class Period {
    private final Date start;

    public Period(Date start) {
        this.start = new Date(start.getTime());   // copy in
    }

    public Date getStart() {
        return new Date(start.getTime());          // copy out
    }
}
```

Copy in **before** validating, or a hostile caller can mutate the value between
the check and the store.

The whole problem disappears with `java.time` — `Instant` and `LocalDate` are
immutable, so no copying is needed.
