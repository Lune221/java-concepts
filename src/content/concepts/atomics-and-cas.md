---
title: "Atomic variables and compare-and-swap"
definition: "Atomic classes use a hardware compare-and-swap instruction to update a value without locking: read, compute, and swap only if nothing changed in between."
topic: "Concurrency"
difficulty: 3
offset: 21
tags: ["atomic", "cas", "lock-free", "concurrency"]
source: "ch. 9, p. 73"
---

`count++` is three operations — read, add, write — and two threads can
interleave inside it. `AtomicInteger` makes the whole update indivisible.

```java
AtomicInteger counter = new AtomicInteger();
counter.incrementAndGet();

// Arbitrary atomic update, retried until it wins the race
counter.updateAndGet(v -> Math.min(v + 1, MAX));
```

The retry loop is the point: CAS fails when another thread got there first, and
the operation simply tries again with the new value. No thread ever blocks,
which is why atomics outperform locks under moderate contention — and why they
degrade under heavy contention, as retries pile up. `LongAdder` exists for that
case, spreading updates across cells and summing on read.

## Only single variables

CAS covers one variable. Two fields that must change together still need a lock
or an immutable holder object swapped atomically with
`AtomicReference`.

## The ABA problem

A value can change from A to B and back to A between your read and your swap;
CAS sees no difference. `AtomicStampedReference` attaches a version counter
when that matters.

## Volatile is not enough

`volatile` guarantees visibility and ordering, not atomicity. A `volatile int`
still loses increments.
