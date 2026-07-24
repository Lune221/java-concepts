---
title: "Method handles"
definition: "A typed, directly executable reference to a method, resolved once through a Lookup that captures the caller's access rights. Faster than reflection and the basis of invokedynamic."
topic: "Reflection"
difficulty: 3
offset: 25
tags: ["method-handles", "invokedynamic", "lambda", "performance"]
source: "ch. 11, p. 88"
---

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();
MethodType type = MethodType.methodType(String.class, int.class, int.class);
MethodHandle mh = lookup.findVirtual(String.class, "substring", type);

String s = (String) mh.invokeExact("hello world", 0, 5);
```

## Against reflection

- Access is checked once, when the handle is looked up, not on every call.
- The handle carries an exact `MethodType`, so the JIT can inline through it.
- Arguments are not boxed into an array.
- It can be transformed: `bindTo`, `asType`, `insertArguments`,
  `filterArguments` build new handles from existing ones.

## invokeExact vs invoke

`invokeExact` demands that the call site's static signature match the handle's
type character for character — including the cast on the return value. `invoke`
inserts the conversions for you and costs a little more. A `WrongMethodTypeException`
from `invokeExact` almost always means a missing cast.

## Where you have already used it

Every lambda you write compiles to an `invokedynamic` instruction whose
bootstrap method builds a `MethodHandle`. That is why lambdas do not generate a
class file per lambda the way anonymous classes do.
