---
title: "Les enums en tant que classes spéciales"
definition: "Une constante d'enum est une instance singleton d'une classe finale générée par le compilateur. Les enums peuvent porter des champs, implémenter des interfaces, et donner à chaque constante son propre corps de méthode."
topic: "Enums et annotations"
difficulty: 2
offset: 12
tags: ["enums", "enumset", "singleton"]
source: "ch. 5, p. 36"
---

```java
public enum Operation {
    PLUS("+")  { public int apply(int a, int b) { return a + b; } },
    TIMES("*") { public int apply(int a, int b) { return a * b; } };

    private final String symbol;

    Operation(String symbol) { this.symbol = symbol; }

    public abstract int apply(int a, int b);

    public String symbol() { return symbol; }
}
```

Les corps spécifiques à une constante compilent vers des sous-classes
anonymes, ce qui explique pourquoi `getClass()` sur `PLUS` n'est pas
`Operation.class` — utilisez `getDeclaringClass()` quand vous avez besoin du
type enum lui-même.

## EnumSet et EnumMap

Les deux exploitent le fait que l'ensemble des constantes est connu et indexé
par ordinal. `EnumSet` est un vecteur de bits, `EnumMap` un simple tableau —
nettement plus petits et rapides que leurs équivalents à base de hachage, et
l'itération suit l'ordre de déclaration.

```java
EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
```

## L'ordinal est un piège

`ordinal()` change dès que quelqu'un réordonne les déclarations. Ne le
persistez jamais et ne basez jamais de logique métier dessus — stockez plutôt
`name()` ou un champ explicite dédié.
