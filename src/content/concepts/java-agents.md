---
title: "Java agents and instrumentation"
definition: "An agent is a jar that runs before or alongside main() and can rewrite bytecode as classes load. It is how profilers, APM tools and mocking frameworks work without touching your source."
topic: "Instrumentation"
difficulty: 3
offset: 29
tags: ["agents", "instrumentation", "bytecode", "premain", "apm"]
source: "ch. 15, p. 109"
---

```java
public class TimingAgent {
    // -javaagent:agent.jar — runs before main()
    public static void premain(String args, Instrumentation inst) {
        inst.addTransformer(new TimingTransformer());
    }

    // attached to an already-running JVM
    public static void agentmain(String args, Instrumentation inst) {
        inst.addTransformer(new TimingTransformer(), true);
        inst.retransformClasses(Target.class);
    }
}
```

The jar's manifest must name the class:

```
Premain-Class: com.example.TimingAgent
Can-Retransform-Classes: true
```

## What Instrumentation gives you

- `addTransformer` — a hook invoked with the raw bytes of every class loaded.
- `retransformClasses` — re-run transformers over already-loaded classes.
- `redefineClasses` — replace a class definition wholesale.
- `getObjectSize` — the shallow size of an instance.

Redefinition cannot add or remove methods or fields, or change the hierarchy.
Method bodies only.

## Writing the transformer

Nobody emits bytecode by hand. ASM is the low-level standard, Byte Buddy and
Javassist the ergonomic layers on top.

## Attaching at runtime

The Attach API connects to a live JVM by process id and loads an agent into it
— the mechanism behind `jcmd`, and behind attaching a profiler to a running
production process. Recent JDKs warn on dynamic attach unless
`-XX:+EnableDynamicAgentLoading` is set.
