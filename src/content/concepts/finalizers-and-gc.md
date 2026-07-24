---
title: "Garbage collection and finalizers"
definition: "The collector reclaims objects unreachable from any GC root, on no schedule you can rely on. finalize() is deprecated and unusable for resource release; Cleaner or try-with-resources is the answer."
topic: "Object lifecycle"
difficulty: 2
offset: 2
tags: ["gc", "finalize", "resources", "cleaner"]
source: "ch. 1, p. 4"
---

Reachability, not scope, decides collection. An object is collectable once no
chain of references reaches it from a GC root — a live thread's stack, a static
field, or a JNI reference.

## Why finalize() fails

- It may never run. The JVM is allowed to exit without finalising anything.
- It runs on an unspecified thread at an unspecified time.
- It costs at least two GC cycles, because a finalizable object must survive
  one collection to be finalised and another to be freed.
- Resurrecting `this` inside it is legal, which makes the whole design unsound.

```java
// The replacement
class Handle implements AutoCloseable {
    @Override public void close() { /* release here */ }
}

try (Handle h = new Handle()) {
    // deterministic release at the end of the block
}
```

## Reference types, weakest last

`SoftReference` is cleared under memory pressure, `WeakReference` at the next
collection, `PhantomReference` only after the object is finalised — the last
being the basis for `Cleaner`, the sanctioned post-mortem hook.
