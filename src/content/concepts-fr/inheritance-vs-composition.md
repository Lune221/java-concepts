---
title: "Héritage vs composition"
definition: "L'héritage couple une sous-classe aux détails d'implémentation de son parent, si bien qu'un changement du parent peut silencieusement la casser. La composition délègue à une instance détenue et ne dépend que du contrat publié."
topic: "Conception des classes"
difficulty: 2
offset: 9
tags: ["inheritance", "composition", "delegation", "encapsulation"]
source: "ch. 3, p. 25"
---

La démonstration classique :

```java
class CountingSet<E> extends HashSet<E> {
    private int added = 0;

    @Override public boolean add(E e) { added++; return super.add(e); }

    @Override public boolean addAll(Collection<? extends E> c) {
        added += c.size();
        return super.addAll(c);          // qui appelle elle-même add()
    }
}
```

`HashSet.addAll` se trouve implémentée en termes de `add`, donc chaque
élément est compté deux fois. Rien dans le contrat documenté ne le disait, et
une future version pourrait changer cela dans un sens ou dans l'autre.

La version composée ne peut pas casser :

```java
class CountingSet<E> {
    private final Set<E> delegate = new HashSet<>();
    private int added = 0;

    public boolean add(E e) { added++; return delegate.add(e); }
}
```

## Quand l'héritage est justifié

Seulement pour une véritable relation « est-un » où le supertype a été conçu
pour l'extension — ce qui signifie qu'il documente ses propres motifs
d'auto-utilisation, ou qu'il est `abstract` avec des méthodes-crochets
clairement désignées. Tout le reste devrait être `final`.
