---
title: "clone, copie et copies défensives"
definition: "Object.clone() produit une copie superficielle à travers un protocole cassé. Un constructeur de copie ou une fabrique statique est plus clair, et les champs mutables qui traversent une frontière d'API doivent être copiés dans les deux sens."
topic: "Méthodes d'objet"
difficulty: 2
offset: 5
tags: ["clone", "copy", "immutability", "encapsulation"]
source: "ch. 2, p. 14"
---

`Cloneable` est une interface marqueur qui ne déclare pas `clone()`, et
`Object.clone()` est `protected` et lève une exception si le marqueur est
absent. Le résultat est une copie superficielle : les objets mutables
imbriqués restent partagés.

```java
// À préférer
public Period(Period other) {
    this.start = new Date(other.start.getTime());
    this.end   = new Date(other.end.getTime());
}
```

## Copie défensive, en entrée et en sortie

Un constructeur qui stocke par référence l'argument mutable d'un appelant lui
a donné un moyen de muter l'objet par la suite. Un getter qui renvoie la
référence interne fait la même chose dans l'autre sens.

```java
public final class Period {
    private final Date start;

    public Period(Date start) {
        this.start = new Date(start.getTime());   // copie en entrée
    }

    public Date getStart() {
        return new Date(start.getTime());          // copie en sortie
    }
}
```

Copiez **avant** de valider, sinon un appelant hostile peut muter la valeur
entre la vérification et le stockage.

Tout le problème disparaît avec `java.time` — `Instant` et `LocalDate` sont
immuables, donc aucune copie n'est nécessaire.
