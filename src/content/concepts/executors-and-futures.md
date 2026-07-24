---
title: "Executors, futures and thread pools"
definition: "An ExecutorService decouples task submission from the threads that run them. Future is a handle on a pending result; CompletableFuture adds composition without blocking."
topic: "Concurrency"
difficulty: 2
offset: 20
tags: ["executors", "futures", "thread-pools", "completablefuture"]
source: "ch. 9, p. 70"
---

Creating threads by hand does not bound concurrency. A pool does, and it also
lets you name threads, which is the difference between a readable thread dump
and an unreadable one.

```java
ExecutorService pool = Executors.newFixedThreadPool(8);
Future<Integer> f = pool.submit(() -> compute());
Integer result = f.get();          // blocks
pool.shutdown();
```

## Choosing a pool

- **Fixed** — bounded, backed by an unbounded queue. Steady CPU-bound work.
- **Cached** — unbounded thread count. Fine for short I/O tasks, dangerous
  under load.
- **Scheduled** — periodic execution.
- **Work-stealing / ForkJoin** — recursive divide-and-conquer.

For anything production-facing, construct `ThreadPoolExecutor` directly so you
control the queue bound and the rejection policy. An unbounded queue turns
overload into an `OutOfMemoryError` instead of backpressure.

## Shutdown

`shutdown()` stops accepting work and drains; `shutdownNow()` interrupts
running tasks and returns those never started. Non-daemon pool threads keep the
JVM alive, so a missing shutdown is a hang.

## submit() hides exceptions

An exception thrown inside `submit()` is captured in the `Future` and vanishes
unless someone calls `get()`. With `execute()` it reaches the thread's
uncaught-exception handler. This asymmetry swallows a lot of errors.

## Composition

```java
CompletableFuture
    .supplyAsync(this::fetch, pool)
    .thenApply(this::parse)
    .exceptionally(e -> fallback())
    .thenAccept(this::store);
```
