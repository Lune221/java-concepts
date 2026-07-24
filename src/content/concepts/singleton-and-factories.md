---
title: "Construction patterns"
definition: "Ways to control instantiation: a singleton guarantees one instance, a static factory names and caches construction, and dependency injection hands collaborators in rather than letting an object build them."
topic: "Object lifecycle"
difficulty: 1
offset: 3
tags: ["singleton", "factory", "di", "patterns"]
source: "ch. 1, p. 5"
---

## Singleton, done correctly

An enum is the only form that is thread-safe, lazily initialised by the JVM,
and immune to both reflection and deserialisation attacks.

```java
public enum Registry {
    INSTANCE;
    public void register(String key) { /* ... */ }
}
```

The double-checked-locking version needs `volatile` on the field to be correct,
and is worth writing only when the instance genuinely must be lazy.

## Static factory over constructor

A factory method has a name, is not obliged to return a new instance, and can
return a subtype. `List.of()`, `Optional.empty()` and `Integer.valueOf()` all
exploit at least one of these.

## Dependency injection

An object that constructs its own collaborators cannot be tested in isolation.
Taking them as constructor parameters makes the dependency explicit and lets
the caller substitute a fake.
