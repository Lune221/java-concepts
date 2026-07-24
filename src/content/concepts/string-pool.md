---
title: "The string constant pool"
definition: "String literals are interned into a JVM-wide pool, so identical literals are the same object. Strings built at runtime are not pooled unless intern() is called explicitly."
topic: "General guidelines"
difficulty: 1
offset: 6
tags: ["strings", "identity", "jvm"]
source: "ch. 7, p. 58"
---

```java
String a = "java";
String b = "java";
String c = new String("java");
String d = c.intern();

a == b;   // true  — same pooled literal
a == c;   // false — new String() always allocates
a == d;   // true  — intern() returns the pooled instance
```

Constant expressions are folded at compile time, so `"ja" + "va"` is also
pooled and `== "java"` is true. Concatenation involving a non-final variable
happens at runtime and is not.

## Why it matters

Identity comparison on strings is a bug that passes its own unit tests,
because the test data is usually literals. Always compare with `equals`.
