---
title: "Agents Java et instrumentation"
definition: "Un agent est un jar qui s'exécute avant ou aux côtés de main() et peut réécrire le bytecode au chargement des classes. C'est ainsi que fonctionnent les profileurs, les outils APM et les frameworks de mock sans toucher à votre source."
topic: "Instrumentation"
difficulty: 3
offset: 29
tags: ["agents", "instrumentation", "bytecode", "premain", "apm"]
source: "ch. 15, p. 109"
---

```java
public class TimingAgent {
    // -javaagent:agent.jar — s'exécute avant main()
    public static void premain(String args, Instrumentation inst) {
        inst.addTransformer(new TimingTransformer());
    }

    // attaché à une JVM déjà en cours d'exécution
    public static void agentmain(String args, Instrumentation inst) {
        inst.addTransformer(new TimingTransformer(), true);
        inst.retransformClasses(Target.class);
    }
}
```

Le manifeste du jar doit nommer la classe :

```
Premain-Class: com.example.TimingAgent
Can-Retransform-Classes: true
```

## Ce que vous offre Instrumentation

- `addTransformer` — un hook invoqué avec les octets bruts de chaque classe
  chargée.
- `retransformClasses` — réexécute les transformateurs sur des classes déjà
  chargées.
- `redefineClasses` — remplace entièrement une définition de classe.
- `getObjectSize` — la taille superficielle d'une instance.

La redéfinition ne peut ni ajouter ni retirer de méthodes ou de champs, ni
changer la hiérarchie. Seulement les corps de méthode.

## Écrire le transformateur

Personne n'émet du bytecode à la main. ASM est le standard bas niveau, Byte
Buddy et Javassist les couches ergonomiques par-dessus.

## S'attacher à l'exécution

L'Attach API se connecte à une JVM vivante par son id de processus et y
charge un agent — le mécanisme derrière `jcmd`, et derrière l'attachement
d'un profileur à un processus de production en cours d'exécution. Les JDK
récents avertissent lors d'un attachement dynamique sauf si
`-XX:+EnableDynamicAgentLoading` est activé.
