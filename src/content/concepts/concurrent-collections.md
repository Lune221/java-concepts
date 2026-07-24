---
title: "Concurrent collections and wait/notify"
definition: "ConcurrentHashMap and the blocking queues provide thread-safe access without a global lock. wait/notify is the low-level primitive underneath, and is almost always the wrong tool now."
topic: "Concurrency"
difficulty: 2
offset: 22
tags: ["concurrenthashmap", "blockingqueue", "wait-notify", "collections"]
source: "ch. 9, p. 74"
---

`Collections.synchronizedMap` serialises every operation on one lock.
`ConcurrentHashMap` locks per bin, so readers never block and writers contend
only on collision.

```java
ConcurrentHashMap<String, Integer> counts = new ConcurrentHashMap<>();
counts.merge(key, 1, Integer::sum);            // atomic
counts.computeIfAbsent(key, k -> load(k));     // computed at most once
```

Compound operations built from `get` then `put` are **not** atomic even on a
concurrent map. Use `merge`, `compute`, `computeIfAbsent` or `putIfAbsent`.

## Iteration semantics

Concurrent collections give weakly consistent iterators: they never throw
`ConcurrentModificationException` and may or may not reflect concurrent
updates. `CopyOnWriteArrayList` snapshots on iteration — ideal for
listener lists, ruinous for write-heavy data.

## Producer/consumer

```java
BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);
queue.put(task);          // blocks when full — backpressure for free
Task t = queue.take();    // blocks when empty
```

## wait/notify, if you must

```java
synchronized (lock) {
    while (!condition) {      // always a loop, never an if
        lock.wait();          // spurious wakeups are permitted
    }
}
```

Call only while holding the monitor, always re-check the predicate in a loop,
and prefer `notifyAll` — `notify` wakes one arbitrary waiter and can strand the
rest. In new code, reach for a `BlockingQueue`, a `CountDownLatch` or a
`Semaphore` instead.
