---
title: "Annotation processors"
definition: "A compile-time plugin that reads annotated elements and generates new source files. It runs in rounds during javac, and it can add code but never modify existing code."
topic: "Compiler tooling"
difficulty: 3
offset: 28
tags: ["apt", "codegen", "javax-annotation-processing", "rounds"]
source: "ch. 14, p. 103"
---

```java
@SupportedAnnotationTypes("com.example.Builder")
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class BuilderProcessor extends AbstractProcessor {

    @Override
    public boolean process(Set<? extends TypeElement> annotations,
                           RoundEnvironment env) {
        for (Element e : env.getElementsAnnotatedWith(Builder.class)) {
            try (Writer w = processingEnv.getFiler()
                    .createSourceFile(name(e)).openWriter()) {
                w.write(generate((TypeElement) e));
            } catch (IOException ex) {
                processingEnv.getMessager()
                    .printMessage(Diagnostic.Kind.ERROR, ex.getMessage(), e);
            }
        }
        return true;   // claimed — no other processor sees these annotations
    }
}
```

Register it in `META-INF/services/javax.annotation.processing.Processor`, or
let Google's `@AutoService` write that file.

## Rounds

Generated sources are themselves compiled and re-processed, so a processor can
trigger further generation. The cycle ends on a round that produces nothing.

## The model, not reflection

You work with `Element`, `TypeMirror` and `TypeElement` — a compile-time view
where the classes do not exist yet. `Types` and `Elements` from
`processingEnv` are the utility classes for navigating it.

## What uses this

Lombok, Dagger, MapStruct, Micronaut, and the JPA static metamodel. Reporting
errors through `Messager` rather than throwing is what gives users a proper
compile error pointing at the offending element.
