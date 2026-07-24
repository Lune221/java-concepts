---
title: "Checked vs unchecked exceptions"
definition: "Checked exceptions extend Exception and must be declared or handled; unchecked ones extend RuntimeException and need neither. The distinction is about whether the caller can plausibly recover."
topic: "Exceptions"
difficulty: 2
offset: 17
tags: ["exceptions", "checked", "runtime", "api-design"]
source: "ch. 8, p. 62"
---

```
Throwable
├── Error              unchecked — do not catch (OutOfMemoryError, StackOverflowError)
└── Exception          checked
    └── RuntimeException  unchecked (NPE, IllegalArgument, IllegalState)
```

Use checked when the caller has a realistic recovery action — retry, fall back,
prompt. Use unchecked for programming errors and violated preconditions, which
the caller cannot do anything about at runtime.

## Never do this

```java
try { risky(); } catch (Exception e) { }          // swallowed
try { risky(); } catch (Exception e) { throw new RuntimeException(e); }  // no context
```

An empty catch block deletes evidence. If you must proceed, log with the cause
and say why.

## Preserve the cause

```java
catch (SQLException e) {
    throw new AccountLookupException("account " + id, e);   // cause chained
}
```

Dropping the cause is the single most common reason a production stack trace
tells you nothing.

## Lambdas make checked exceptions awkward

`Function.apply` declares no checked exception, so a lambda body cannot throw
one. The usual answers are a wrapper that converts to unchecked, or a custom
functional interface that declares `throws E`.
