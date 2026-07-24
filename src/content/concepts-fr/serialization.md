---
title: "La sérialisation Java"
definition: "Serializable est un marqueur qui permet à la JVM d'écrire un graphe d'objets sous forme d'octets. C'est une API publique cachée pour vos champs privés, un fardeau de compatibilité, et une surface d'attaque bien connue."
topic: "Sérialisation"
difficulty: 2
offset: 23
tags: ["serializable", "serialversionuid", "transient", "externalizable"]
source: "ch. 10, p. 78"
---

```java
class Session implements Serializable {
    private static final long serialVersionUID = 1L;

    private String user;
    private transient Cipher cipher;   // exclu du flux
}
```

## serialVersionUID

Omettez-le et le compilateur en dérive un depuis la structure de la classe,
donc presque toute modification — ajouter une méthode, changer un modificateur
— casse la désérialisation des données existantes avec
`InvalidClassException`. Déclarez-le explicitement, toujours.

## Ce que le format vous coûte

- Les champs privés deviennent partie du contrat publié.
- La désérialisation construit les objets **sans exécuter le constructeur**,
  donc chaque invariant que vous y appliquez est contourné.
- Le constructeur sans argument de la première superclasse non sérialisable
  *est* exécuté, et doit exister.
- Désérialiser des octets non fiables a produit de l'exécution de code
  distant dans de nombreuses bibliothèques largement utilisées. C'est la
  raison d'être des filtres de sérialisation (`ObjectInputFilter`).

## Externalizable

`writeExternal`/`readExternal` vous donnent un contrôle complet et un flux
plus rapide et plus compact — au prix d'écrire et de maintenir les deux côtés
à la main, et de nécessiter un constructeur public sans argument.

## En pratique

Pour tout ce qui traverse une frontière de processus ou de stockage, utilisez
un format explicite — JSON, Protobuf, Avro — où le schéma est visible et le
versionnement est une décision plutôt qu'un accident.
