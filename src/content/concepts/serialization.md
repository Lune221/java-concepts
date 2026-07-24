---
title: "Java serialization"
definition: "Serializable is a marker that lets the JVM write an object graph as bytes. It is a hidden public API for your private fields, a compatibility burden, and a well-known attack surface."
topic: "Serialization"
difficulty: 2
offset: 23
tags: ["serializable", "serialversionuid", "transient", "externalizable"]
source: "ch. 10, p. 78"
---

```java
class Session implements Serializable {
    private static final long serialVersionUID = 1L;

    private String user;
    private transient Cipher cipher;   // excluded from the stream
}
```

## serialVersionUID

Omit it and the compiler derives one from the class structure, so almost any
edit — adding a method, changing a modifier — breaks deserialisation of
existing data with `InvalidClassException`. Declare it explicitly, always.

## What the format costs you

- Private fields become part of the published contract.
- Deserialisation constructs objects **without running the constructor**, so
  every invariant you enforce there is bypassed.
- The no-arg constructor of the first non-serialisable superclass *is* run, and
  must exist.
- Deserialising untrusted bytes has produced remote-code-execution in many
  widely used libraries. This is the reason serialization filters
  (`ObjectInputFilter`) exist.

## Externalizable

`writeExternal`/`readExternal` give you complete control and a faster, smaller
stream — at the cost of writing and maintaining both sides by hand, and needing
a public no-arg constructor.

## In practice

For anything crossing a process or storage boundary, use an explicit format —
JSON, Protobuf, Avro — where the schema is visible and versioning is a decision
rather than an accident.
