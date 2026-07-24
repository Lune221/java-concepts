---
title: "L'API de scripting"
definition: "javax.script (JSR-223) exécute d'autres langages sur la JVM à travers une interface ScriptEngine uniforme, échangeant des variables avec Java via des bindings."
topic: "Langages dynamiques"
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

Les moteurs sont découverts via `ServiceLoader`, donc ajouter un langage
consiste simplement à mettre son jar sur le classpath. Groovy, JRuby et
Jython livrent tous des moteurs JSR-223.

## Compiler et réutiliser

```java
if (engine instanceof Compilable c) {
    CompiledScript script = c.compile(source);   // analyse une fois
    script.eval(bindings);                       // exécute plusieurs fois
}
```

`Invocable` va plus loin, en permettant d'appeler une fonction de script
directement ou d'obtenir une interface Java implémentée par le script.

## Nashorn

Le moteur JavaScript livré depuis Java 8 a été déprécié en 11 et retiré en
15. Si vous avez besoin de JavaScript sur la JVM aujourd'hui, c'est le moteur
`js` de GraalVM, qui implémente aussi JSR-223.

## Où cela se justifie

Les règles métier fournies par l'utilisateur qui changent plus vite que votre
cycle de release. Tout ce qui est évalué ainsi est du code, donc isolez-le
en bac à sable et ne faites jamais un `eval` d'une chaîne construite à partir
d'une entrée utilisateur.
