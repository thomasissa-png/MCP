<!-- Version: 2026-07-20 — @legal — Texte 7/11 checklist §7 (item 8) : Mention "non affilié officiellement" -->

# Mention de non-affiliation officielle : gabarit

**Usage** : cette mention doit apparaître sur chaque fiche produit (pied de fiche), en plus des mentions légales générales (`03-mentions-legales.md` §5).

## Gabarit générique (à insérer sur chaque fiche)

> Parrainly n'est pas affilié officiellement à [NOM DU PROGRAMME]. Le lien présenté est un lien de parrainage personnel, pas un partenariat commercial formalisé avec la marque. Les informations affichées (avantages, conditions) proviennent de la vérification effectuée le [date_verification] et peuvent évoluer sans préavis de la part de [NOM DU PROGRAMME].

## Version courte (si contrainte d'espace sur mobile)

> Non affilié officiellement à [NOM DU PROGRAMME]. Infos vérifiées le [date_verification].

## Justification juridique

Cette mention protège contre deux risques distincts (§8 de `legal-strategy.md`, risque P2, art. L.713-1 CPI) :
1. **Confusion de marque / parasitisme** : éviter que l'utilisateur pense que le programme tiers a validé, sponsorisé ou approuvé le contenu de la fiche Parrainly.
2. **Usage des logos/noms** : les noms des marques (Trade Republic, Qonto, etc.) sont utilisés à titre purement nominatif/descriptif (désignation du service), ce qui est licite sans autorisation préalable dans la plupart des cas de citation loyale, mais l'usage d'un **logo** nécessite en principe une licence ou, à défaut, doit être évité au profit du nom textuel seul. `[À VÉRIFIER PAR UN JURISTE]` : vérifier au cas par cas si les logos des 9 programmes sont utilisés visuellement sur les fiches (si oui, contacter chaque marque pour une autorisation d'usage ou retirer le logo au profit du texte seul).

## Application aux 9 programmes réels

À insérer, avec le nom exact du programme, sur chacune des 9 fiches : Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko. Le champ `date_verification` existe déjà dans le schéma de données (`data/base-parrainage.json`), directement exploitable pour l'interpolation dynamique de la mention.

---
**Sources** : art. L.713-1 du Code de la propriété intellectuelle (contrefaçon de marque) ; principe de l'usage nominatif descriptif loyal d'une marque (jurisprudence constante, non citée précisément faute de recherche dédiée cette session, `[À VÉRIFIER PAR UN JURISTE]` sur la jurisprudence exacte applicable à l'usage de logos).
