---
title: "Processeurs d'annotations"
definition: "Un plugin de compilation qui lit les éléments annotés et génère de nouveaux fichiers source. Il s'exécute par rounds pendant javac, et peut ajouter du code mais jamais modifier du code existant."
topic: "Outillage du compilateur"
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
        return true;   // revendiquées — aucun autre processeur ne voit ces annotations
    }
}
```

Enregistrez-le dans `META-INF/services/javax.annotation.processing.Processor`,
ou laissez `@AutoService` de Google écrire ce fichier.

## Rounds

Les sources générées sont elles-mêmes compilées et retraitées, donc un
processeur peut déclencher une génération supplémentaire. Le cycle se termine
sur un round qui ne produit rien.

## Le modèle, pas la réflexion

Vous travaillez avec `Element`, `TypeMirror` et `TypeElement` — une vue à la
compilation où les classes n'existent pas encore. `Types` et `Elements`
depuis `processingEnv` sont les classes utilitaires pour la naviguer.

## Ce qui utilise cela

Lombok, Dagger, MapStruct, Micronaut, et le métamodèle statique JPA. Signaler
les erreurs via `Messager` plutôt que de lancer une exception est ce qui
donne aux utilisateurs une véritable erreur de compilation pointant vers
l'élément fautif.
