---
title: "L'API de réflexion"
definition: "La réflexion inspecte et invoque des types découverts à l'exécution. Elle propulse chaque framework que vous utilisez, et elle vous coûte la sécurité à la compilation, la performance, et la facilité de refactoring."
topic: "Réflexion"
difficulty: 2
offset: 24
tags: ["reflection", "setaccessible", "frameworks", "classloading"]
source: "ch. 11, p. 85"
---

```java
Class<?> type = Class.forName("com.example.Service");
Object instance = type.getDeclaredConstructor().newInstance();

Method m = type.getDeclaredMethod("execute", String.class);
m.setAccessible(true);
Object result = m.invoke(instance, "payload");
```

## getX vs getDeclaredX

`getMethods()` renvoie les membres publics, y compris hérités.
`getDeclaredMethods()` renvoie tout ce qui est déclaré sur cette classe
exacte, y compris privé, mais rien d'hérité. Confondre les deux est le bug de
réflexion le plus courant.

## Coûts

- Rien n'est vérifié avant l'exécution ; un renommage le casse silencieusement.
- `invoke` emballe les arguments dans un `Object[]` et enveloppe toute
  exception lancée dans `InvocationTargetException` — toujours déballer avec
  `getCause()`.
- Les appels réflexifs résistent à l'inlining, bien que le JIT moderne réduise
  l'écart.
- Depuis Java 9, `setAccessible` sur les internes d'un autre module est
  refusé sauf si ce module ouvre le package. C'est pourquoi d'anciennes
  bibliothèques ont cassé sur 9+.

## Relire les génériques

L'effacement retire les arguments de type des valeurs mais conserve les
signatures dans le fichier de classe, donc les types déclarés restent
lisibles :

```java
Type t = field.getGenericType();
if (t instanceof ParameterizedType pt) {
    Type arg = pt.getActualTypeArguments()[0];   // par ex. String
}
```
