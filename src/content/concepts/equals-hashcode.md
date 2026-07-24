---
title: "The equals/hashCode contract"
definition: "Equal objects must have equal hash codes. Break this and the object silently misbehaves in every hash-based collection — it goes into a HashMap and never comes back out."
topic: "Object methods"
difficulty: 2
offset: 4
tags: ["equals", "hashcode", "collections", "contract"]
source: "ch. 2, p. 11"
---

`equals` must be reflexive, symmetric, transitive, consistent, and false for
`null`. `hashCode` must agree with it: **equal implies equal hash**. The
converse is not required — collisions are legal.

```java
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Point)) return false;
    Point p = (Point) o;
    return x == p.x && y == p.y;
}

@Override public int hashCode() {
    return Objects.hash(x, y);
}
```

## The failure mode

```java
Set<Point> set = new HashSet<>();
set.add(new Point(1, 2));
set.contains(new Point(1, 2));   // false if hashCode was not overridden
```

The lookup hashes to a different bucket and never reaches the `equals` call.

## Mutability makes it worse

Mutate a field that participates in `hashCode` after insertion and the element
is stranded in the wrong bucket — still in the set, unreachable by lookup, and
not removable. Hash keys should be immutable.

## Symmetry and inheritance

Using `getClass() != o.getClass()` is stricter than `instanceof` but keeps
symmetry when subclasses add state. `instanceof` breaks symmetry unless the
subclass adds no fields to the comparison.
