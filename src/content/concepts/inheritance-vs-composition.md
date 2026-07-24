---
title: "Inheritance vs composition"
definition: "Inheritance couples a subclass to its parent's implementation details, so a parent change can silently break it. Composition delegates to a held instance and depends only on the published contract."
topic: "Class design"
difficulty: 2
offset: 9
tags: ["inheritance", "composition", "delegation", "encapsulation"]
source: "ch. 3, p. 25"
---

The classic demonstration:

```java
class CountingSet<E> extends HashSet<E> {
    private int added = 0;

    @Override public boolean add(E e) { added++; return super.add(e); }

    @Override public boolean addAll(Collection<? extends E> c) {
        added += c.size();
        return super.addAll(c);          // which itself calls add()
    }
}
```

`HashSet.addAll` happens to be implemented in terms of `add`, so every element
is counted twice. Nothing in the documented contract said so, and a future
release could change it either way.

The composed version cannot break:

```java
class CountingSet<E> {
    private final Set<E> delegate = new HashSet<>();
    private int added = 0;

    public boolean add(E e) { added++; return delegate.add(e); }
}
```

## When inheritance is right

Only for a true "is-a" relationship where the supertype was designed for
extension — meaning it documents its self-use patterns, or it is `abstract`
with clearly designated hook methods. Anything else should be `final`.
