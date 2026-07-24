---
title: "Le contrat equals/hashCode"
definition: "Des objets égaux doivent avoir des hash codes égaux. Enfreignez cela et l'objet se comporte mal silencieusement dans toute collection à base de hachage — il entre dans une HashMap et n'en ressort jamais."
topic: "Méthodes d'objet"
difficulty: 2
offset: 4
tags: ["equals", "hashcode", "collections", "contract"]
source: "ch. 2, p. 11"
---

`equals` doit être réflexif, symétrique, transitif, cohérent, et faux pour
`null`. `hashCode` doit s'accorder avec lui : **égal implique hash égal**.
La réciproque n'est pas exigée — les collisions sont légales.

```java
@Override public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Point)) return false;
    Point p = (Point) o;
    return x == p.x && y == p.y;
}

@Override public int hashCode() {
    return Objects.hash(x, y);
}
```

## Le mode d'échec

```java
Set<Point> set = new HashSet<>();
set.add(new Point(1, 2));
set.contains(new Point(1, 2));   // false si hashCode n'a pas été redéfini
```

La recherche hache vers un compartiment différent et n'atteint jamais l'appel
à `equals`.

## La mutabilité aggrave les choses

Muter un champ qui participe au `hashCode` après insertion échoue l'élément
dans le mauvais compartiment — toujours dans l'ensemble, inaccessible par
recherche, et impossible à retirer. Les clés de hachage devraient être
immuables.

## Symétrie et héritage

Utiliser `getClass() != o.getClass()` est plus strict que `instanceof` mais
conserve la symétrie quand les sous-classes ajoutent de l'état. `instanceof`
brise la symétrie sauf si la sous-classe n'ajoute aucun champ à la
comparaison.
