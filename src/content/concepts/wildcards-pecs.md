---
title: "Wildcards and PECS"
definition: "? extends T gives a producer you can only read from; ? super T gives a consumer you can only write to. Producer Extends, Consumer Super."
topic: "Generics"
difficulty: 3
offset: 11
tags: ["generics", "wildcards", "variance", "pecs"]
source: "ch. 4, p. 31"
---

Generics are invariant: `List<String>` is not a `List<Object>`. Wildcards
reintroduce the variance you actually need, one direction at a time.

```java
void copy(List<? extends Number> src, List<? super Number> dst) {
    for (Number n : src) {   // reading from src is safe
        dst.add(n);          // writing to dst is safe
    }
}
```

- From `List<? extends Number>` you can read a `Number`, but you cannot add
  anything — the actual list might be a `List<Integer>`.
- To `List<? super Number>` you can add any `Number`, but a read gives back
  only `Object`.

`Collections.copy` and `Stream.map` are both written this way.

## The unbounded wildcard

`List<?>` accepts any parameterisation but permits no additions except `null`.
It is not the same as the raw type `List`, which switches off generic checking
altogether and produces unchecked warnings.

## Capture

```java
void reverse(List<?> list) { doReverse(list); }
private <T> void doReverse(List<T> list) { /* T is now nameable */ }
```

The helper gives the anonymous captured type a name, which is the standard way
around "cannot add to a `List<?>`".
