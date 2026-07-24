---
title: "The Scripting API"
definition: "javax.script (JSR-223) runs other languages on the JVM through a uniform ScriptEngine interface, exchanging variables with Java through bindings."
topic: "Dynamic languages"
difficulty: 1
offset: 26
tags: ["jsr-223", "scripting", "nashorn", "groovy"]
source: "ch. 12, p. 90"
---

```java
ScriptEngine engine = new ScriptEngineManager().getEngineByName("groovy");

Bindings bindings = engine.createBindings();
bindings.put("amount", 1500);
Object out = engine.eval("amount > 1000 ? 'high' : 'low'", bindings);
```

Engines are discovered through `ServiceLoader`, so adding a language is a
matter of putting its jar on the classpath. Groovy, JRuby and Jython all ship
JSR-223 engines.

## Compiling and reusing

```java
if (engine instanceof Compilable c) {
    CompiledScript script = c.compile(source);   // parse once
    script.eval(bindings);                       // run many times
}
```

`Invocable` goes further, letting you call a script function directly or get a
Java interface implemented by the script.

## Nashorn

The JavaScript engine bundled from Java 8 was deprecated in 11 and removed in
15. If you need JavaScript on the JVM now, that is GraalVM's `js` engine, which
also implements JSR-223.

## Where this earns its keep

User-supplied business rules that change faster than your release cycle.
Everything evaluated this way is code, so sandbox it and never `eval` a string
built from user input.
