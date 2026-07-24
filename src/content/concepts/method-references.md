---
title: "Method references"
definition: "A compact lambda that just calls an existing method. Four forms: static, bound instance, unbound instance, and constructor."
topic: "Methods"
difficulty: 1
offset: 15
tags: ["method-references", "lambda", "streams", "java8"]
source: "ch. 6, p. 50"
---

```java
Function<String, Integer> parse   = Integer::parseInt;      // static
Supplier<Integer>         size    = list::size;             // bound instance
Function<String, Integer> length  = String::length;         // unbound instance
Supplier<List<String>>    factory = ArrayList::new;         // constructor
```

The unbound form is the one that surprises people: `String::length` becomes a
one-argument function whose argument *is* the receiver.

## Bound references capture eagerly

```java
List<String> list = new ArrayList<>();
Supplier<Integer> s = list::size;
list = new ArrayList<>(List.of("a"));
s.get();   // 0 — bound to the original object, not the variable
```

The receiver is evaluated when the reference is created. A lambda
`() -> list.size()` would not compile here, since `list` is not effectively
final.

## Ambiguity

`Integer::parseInt` could target `Function<String,Integer>` or
`ToIntFunction<String>`; the target type decides. When both are plausible in
context, the compiler reports ambiguity and an explicit lambda resolves it.
