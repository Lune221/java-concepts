---
title: "Construction and initialisation order"
definition: "Creating an instance runs a fixed sequence: field initialisers and instance blocks in source order, then the constructor body — and the superclass finishes all of that before the subclass starts."
topic: "Object lifecycle"
difficulty: 2
offset: 1
tags: ["constructors", "initialisation", "inheritance"]
source: "ch. 1, p. 1"
---

The order is fixed and worth memorising, because a surprising number of
initialisation bugs are just this sequence being misread.

1. Static fields and static blocks, once, when the class is first initialised.
2. The superclass instance initialisation, in full.
3. Instance field initialisers and instance blocks, in source order.
4. The constructor body.

## The trap: calling an overridable method from a constructor

```java
class Base {
    Base() { init(); }              // runs before Derived's fields exist
    void init() {}
}

class Derived extends Base {
    private final List<String> items = new ArrayList<>();

    @Override void init() { items.add("x"); }   // NullPointerException
}
```

Step 2 completes before step 3, so `items` is still `null` when the overridden
`init()` runs. Constructors should call only `private`, `static` or `final`
methods.

## Construction guarantee

A constructor that throws leaves no usable reference behind — the object is
never published. This is what makes constructor-based validation reliable, and
why a `final` field assigned exactly once in the constructor is safe to publish
across threads.
