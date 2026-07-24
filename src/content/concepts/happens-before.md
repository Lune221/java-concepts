---
title: "Happens-before"
definition: "A partial ordering on memory operations. If action A happens-before action B, everything A wrote is visible to B. Without such an edge, the JVM is free to reorder and a thread may read stale values indefinitely."
topic: "Concurrency"
difficulty: 3
offset: 19
tags: ["jmm", "memory-model", "volatile", "visibility"]
source: "ch. 9, p. 68"
---

Happens-before is not about time. Two actions can be separated by minutes of
wall clock and still have no happens-before edge between them, in which case
the second one may observe a stale value forever.

## Where the edges come from

- **Program order** — within a single thread, earlier statements happen-before later ones.
- **Monitor lock** — unlocking a monitor happens-before every subsequent lock of that same monitor.
- **Volatile** — a write to a `volatile` field happens-before every subsequent read of it.
- **Thread start** — `Thread.start()` happens-before any action in the started thread.
- **Thread join** — every action in a thread happens-before another thread's successful return from `join()` on it.
- **Transitivity** — if A happens-before B and B happens-before C, then A happens-before C.

## The classic failure

```java
class Stopper {
    private boolean stop = false;          // not volatile

    void run() {
        while (!stop) { /* work */ }       // may hoist the read out of the loop
    }

    void requestStop() { stop = true; }    // no happens-before edge to run()
}
```

The JIT is entitled to hoist the field read out of the loop because nothing
establishes an ordering. Marking `stop` as `volatile` creates the edge and the
loop terminates.

## What people get wrong

Assuming `synchronized` is only about mutual exclusion. It is equally about
visibility — the lock release/acquire pair is what publishes the writes.
