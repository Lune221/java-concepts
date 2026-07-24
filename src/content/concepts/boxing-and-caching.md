---
title: "Boxing, unboxing and the Integer cache"
definition: "Autoboxing silently converts between primitives and wrappers. Values from -128 to 127 come from a shared cache, so == appears to work on small numbers and fails on large ones."
topic: "General guidelines"
difficulty: 2
offset: 16
tags: ["autoboxing", "integer-cache", "identity", "npe"]
source: "ch. 7, p. 57"
---

```java
Integer a = 127, b = 127;
Integer c = 128, d = 128;

a == b;   // true  — both from the cache
c == d;   // false — two separate objects
```

`Integer.valueOf` caches −128…127 by specification. `Boolean`, `Byte`,
`Character` up to 127, `Short` and `Long` cache too; `Float` and `Double`
never do.

## The three real hazards

**Unboxing a null.** `map.get(missingKey)` returns `null`, and assigning it to
an `int` throws `NullPointerException` at a line that contains no visible
method call.

```java
Map<String, Integer> counts = new HashMap<>();
int n = counts.get("absent");        // NPE
```

**Mixed comparison.** `Integer == int` unboxes and compares numerically;
`Integer == Integer` compares references. One character changes the meaning.

**Silent allocation in loops.** A `Long` accumulator in a tight loop boxes on
every iteration. Declare accumulators as primitives.

## Rule

Use primitives unless you need `null`, a collection element, or a generic type
argument. Compare wrappers with `equals`, or call `intValue()` first.
