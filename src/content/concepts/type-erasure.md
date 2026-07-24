---
title: "Type erasure"
definition: "Generic type arguments exist only at compile time. The compiler checks them, then erases them to their bounds and inserts casts, so the bytecode carries no record of the parameterisation."
topic: "Generics"
difficulty: 2
offset: 10
tags: ["generics", "bytecode", "reflection"]
source: "ch. 4, p. 30"
---

`List<String>` and `List<Integer>` compile to the same class. The angle
brackets are a proof obligation discharged at compile time, not a runtime
property.

## Consequences you actually hit

- `new T[10]` does not compile — the array's runtime component type is unknown.
- `instanceof List<String>` does not compile; only `instanceof List<?>` does.
- Two methods differing only in their generic parameter clash after erasure.

```java
void f(List<String> a) {}
void f(List<Integer> a) {}   // name clash: same erasure
```

## The escape hatch

Erasure is not total: generic signatures are retained in a separate class-file
attribute for reflection and for the compiler reading a library.
`Class.getGenericSuperclass()` reads it, which is how the super-type-token
trick works.

```java
abstract class TypeRef<T> {
    final Type type = ((ParameterizedType) getClass()
        .getGenericSuperclass()).getActualTypeArguments()[0];
}
Type t = new TypeRef<List<String>>() {}.type;   // List<String>
```
