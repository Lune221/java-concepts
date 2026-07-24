---
title: "The Reflection API"
definition: "Reflection inspects and invokes types discovered at runtime. It powers every framework you use, and it costs you compile-time safety, performance, and refactoring."
topic: "Reflection"
difficulty: 2
offset: 24
tags: ["reflection", "setaccessible", "frameworks", "classloading"]
source: "ch. 11, p. 85"
---

```java
Class<?> type = Class.forName("com.example.Service");
Object instance = type.getDeclaredConstructor().newInstance();

Method m = type.getDeclaredMethod("execute", String.class);
m.setAccessible(true);
Object result = m.invoke(instance, "payload");
```

## getX vs getDeclaredX

`getMethods()` returns public members including inherited ones.
`getDeclaredMethods()` returns everything declared on that exact class,
including private, but nothing inherited. Confusing the two is the most common
reflection bug.

## Costs

- Nothing is checked until runtime; a rename breaks it silently.
- `invoke` boxes arguments into an `Object[]` and wraps any thrown exception in
  `InvocationTargetException` — always unwrap with `getCause()`.
- Reflective calls resist inlining, though the modern JIT narrows the gap.
- Since Java 9, `setAccessible` on another module's internals is refused unless
  that module opens the package. This is why older libraries broke on 9+.

## Reading generics back

Erasure removes type arguments from values but keeps signatures in the class
file, so declared types remain readable:

```java
Type t = field.getGenericType();
if (t instanceof ParameterizedType pt) {
    Type arg = pt.getActualTypeArguments()[0];   // e.g. String
}
```
