---
title: "Classes immuables"
definition: "Un objet dont l'état observable ne peut pas changer après construction. Les objets immuables sont automatiquement thread-safe, librement partageables, et sûrs comme clés de map."
topic: "Conception des classes"
difficulty: 2
offset: 8
tags: ["immutability", "thread-safety", "final", "records"]
source: "ch. 3, p. 20"
---

La recette :

- Rendre la classe `final`, ou tous les constructeurs privés, pour que le
  comportement ne puisse pas être redéfini.
- Rendre chaque champ `private final`.
- Ne fournir aucun mutateur.
- Copier défensivement tout composant mutable à l'entrée comme à la sortie.

```java
public final class Money {
    private final BigDecimal amount;
    private final Currency currency;

    public Money(BigDecimal amount, Currency currency) {
        this.amount = Objects.requireNonNull(amount);
        this.currency = Objects.requireNonNull(currency);
    }

    public Money plus(Money other) {          // renvoie une nouvelle instance
        if (!currency.equals(other.currency))
            throw new IllegalArgumentException("currency mismatch");
        return new Money(amount.add(other.amount), currency);
    }
}
```

## La garantie des champs final

Le modèle mémoire fait une promesse spéciale : une fois qu'un constructeur se
termine sans laisser `this` s'échapper, chaque thread voit les valeurs
correctement initialisées de ses champs `final`, sans aucune synchronisation.
Laissez `this` s'échapper du constructeur et la garantie disparaît.

## Coût

Chaque modification alloue. C'est généralement sans importance, et là où ça
l'est, le motif est un builder mutable produisant un résultat immuable —
`String` et `StringBuilder` étant la paire canonique.
