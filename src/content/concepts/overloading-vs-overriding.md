---
title: "Overloading vs overriding"
definition: "Overload resolution picks a method from the static types at compile time. Override dispatch picks the implementation from the runtime type. Mixing them up produces code that calls something you did not expect."
topic: "Methods"
difficulty: 3
offset: 14
tags: ["overloading", "overriding", "dispatch", "polymorphism"]
source: "ch. 6, p. 48"
---

```java
class Printer {
    void print(Object o) { System.out.println("Object"); }
    void print(String s) { System.out.println("String"); }
}

Object value = "hello";
new Printer().print(value);      // prints "Object"
```

The declared type of `value` is `Object`, and that is all the compiler
consults. Overloading is resolved statically; only overriding is dynamic.

## Resolution order

The compiler tries three phases in turn, and stops at the first that finds a
match:

1. Widening only — no boxing, no varargs.
2. Boxing and unboxing allowed.
3. Varargs allowed.

So `f(int)` beats `f(Integer)` beats `f(int...)` for a call `f(1)`. This is why
adding an overload to a published API is a source-compatible but
behaviour-breaking change.

## Overriding rules

- The parameter list must match exactly; anything else is an overload.
- The return type may be covariant.
- Visibility may widen but never narrow.
- A checked exception may be narrowed or dropped but never broadened.
- `static` methods are hidden, not overridden, and dispatch on the static type.

Always write `@Override`. It converts a silent accidental overload into a
compile error.
