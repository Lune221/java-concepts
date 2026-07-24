---
title: "try-with-resources and suppressed exceptions"
definition: "Any AutoCloseable declared in the try header is closed automatically, in reverse order, even on exception — and a failure during close is attached to the primary exception rather than replacing it."
topic: "Exceptions"
difficulty: 2
offset: 18
tags: ["resources", "autocloseable", "suppressed", "finally"]
source: "ch. 8, p. 63"
---

```java
try (InputStream in = Files.newInputStream(src);
     OutputStream out = Files.newOutputStream(dst)) {
    in.transferTo(out);
}   // out closed first, then in — both guaranteed
```

## What the old form got wrong

```java
InputStream in = null;
try {
    in = Files.newInputStream(src);
    read(in);                       // throws IOException  <- the real cause
} finally {
    if (in != null) in.close();     // also throws          <- this one wins
}
```

The exception from `close()` replaces the one you care about. `try-with-resources`
keeps the first and records the second:

```java
catch (IOException e) {
    for (Throwable s : e.getSuppressed()) { /* the close failure */ }
}
```

## Details

- Resources must be effectively final; since Java 9 an existing final variable
  can be named directly in the header.
- `close()` should be idempotent, because nothing prevents a second call.
- A `finally` block still runs after all resources are closed, if you need one.
