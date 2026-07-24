---
title: "Functional interfaces, default and static methods"
definition: "An interface with exactly one abstract method can be implemented by a lambda. Default methods let interfaces gain behaviour without breaking implementers, which is how Java retrofitted streams onto Collection."
topic: "Class design"
difficulty: 2
offset: 7
tags: ["lambda", "default-methods", "interfaces", "java8"]
source: "ch. 3, p. 19"
---

`@FunctionalInterface` is optional but worth applying — it makes the compiler
reject a second abstract method, turning an accidental API break into a build
failure.

```java
@FunctionalInterface
interface Validator<T> {
    boolean test(T value);

    default Validator<T> and(Validator<T> other) {
        return v -> this.test(v) && other.test(v);
    }

    static <T> Validator<T> always() { return v -> true; }
}
```

Methods inherited from `Object` do not count towards the one-abstract-method
rule, which is why `Comparator` can declare `equals` and still be functional.

## The diamond, resolved

If two interfaces supply the same default method, the implementing class must
override it and disambiguate explicitly:

```java
class C implements A, B {
    @Override public void hello() { A.super.hello(); }
}
```

Class implementations always win over interface defaults, and a more specific
interface wins over a less specific one.

## Static methods on interfaces

They are not inherited. `Validator.always()` is reachable only through the
interface name, which keeps helper methods next to the type they serve instead
of in a separate `Validators` utility class.
