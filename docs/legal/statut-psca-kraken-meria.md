<!-- Version: 2026-07-20 — @legal — Statut PSAN/PSCA/MiCA Kraken & Meria (checklist §7 item 11, bloquant) -->

# Statut réglementaire PSAN/PSCA/MiCA — Kraken et Meria

## Résumé exécutif — risques en 5 points

1. **Bonne nouvelle confirmée cette session** : Kraken ET Meria disposent tous les deux d'un agrément MiCA/PSCA valide en 2026 (vérifié par WebSearch, sources ci-dessous). Le risque pénal identifié par `legal-strategy.md` (promotion d'un prestataire non autorisé, 2 ans/30 000 € — art. L.54-10-4, L.572-23 du Code monétaire et financier) **ne se matérialise pas** pour ces deux programmes à la date de cette vérification.
2. **La date d'échéance réglementaire (1er juillet 2026) est déjà passée** au moment de cette vérification (20 juillet 2026) : la période transitoire PSAN a pris fin, et Kraken/Meria ont déjà obtenu leur agrément CASP/PSCA (pas seulement le statut transitoire). C'est le scénario le plus favorable possible.
3. **Ce statut est évolutif, pas figé** : `legal-strategy.md` §2c le rappelait déjà, un agrément peut en théorie être retiré ou suspendu. Vérification à refaire avant toute intégration réelle en production, pas seulement au moment de ce document (recommandation : intégrer un contrôle trimestriel à la checklist plateformes, `docs/legal/textes/09-checklist-cgu-plateformes-ia.md`, ou une checklist dédiée si le catalogue crypto s'étend).
4. **Ce statut ne dispense PAS des autres conditions bloquantes** : mentions de risque obligatoires (`docs/legal/textes/06-mentions-risque-financier-crypto.md`) et surtout la clause de diffusion publique du programme de parrainage lui-même (Kraken interdit explicitement la diffusion publique, voir `docs/legal/fiches-conformite/kraken.md` — Meria non tranché, voir `docs/legal/fiches-conformite/meria.md`). Le statut réglementaire de l'émetteur crypto et la clause contractuelle du programme de parrainage sont deux questions indépendantes, toutes deux à satisfaire.
5. **Kraken opère via une entité européenne (Payward Europe Solutions Limited, Irlande), pas une entité française** : le passeport européen MiCA s'applique, mais cela signifie que les CGU de parrainage applicables à un utilisateur FR peuvent renvoyer aux règles de l'entité irlandaise. `[À VÉRIFIER PAR UN JURISTE]` si cela change quoi que ce soit à l'analyse de diffusion (a priori non, la clause de diffusion identifiée provient de la page globale kraken.com/legal/referrals).

## Kraken

**Statut confirmé** : agréé CASP (Crypto-Asset Service Provider) au sens MiCA, obtenu en 2025, via l'entité **Payward Europe Solutions Limited**, agréée par la Banque centrale d'Irlande (CBI), opérant sous passeport européen. Kraken est également enregistré PSAN auprès de l'AMF (statut antérieur, complété par l'agrément MiCA).

**Conséquence pour Parrainly** : aucun obstacle réglementaire (statut PSCA) à la présentation d'un lien de parrainage Kraken. Le point bloquant identifié pour Kraken est exclusivement la clause de diffusion publique de son programme de parrainage (voir `docs/legal/fiches-conformite/kraken.md`), pas son statut réglementaire.

## Meria

**Statut confirmé** : Meria dispose de l'agrément **PSCA (Prestataire de Services sur Crypto-Actifs) sous le numéro PSCA-AGR-2026-020**, délivré par l'AMF, couvrant l'ensemble des services d'investissement en crypto-actifs (conservation, échange, exécution d'ordres, conseil, gestion de portefeuille, transfert). Meria est présentée comme le premier acteur français à obtenir une licence MiCA aussi complète, avec un historique PSAN depuis 2021 (enregistrement antérieur à l'agrément).

**Conséquence pour Parrainly** : aucun obstacle réglementaire à la présentation d'un lien de parrainage Meria. Le point restant ouvert pour Meria est la clause de diffusion publique de son programme de parrainage, non tranchée par cette recherche (voir `docs/legal/fiches-conformite/meria.md`, verdict "À VÉRIFIER").

## Contexte réglementaire général (rappel)

Selon l'AMF (janvier 2026), environ 90 prestataires PSAN n'avaient pas encore obtenu leur agrément MiCA, dont seulement 30% avaient déposé un dossier complet. Kraken et Meria font partie des acteurs déjà en règle, ce qui n'est pas le cas de l'ensemble du marché : **ce contrôle doit être refait individuellement pour tout nouveau programme crypto ajouté au catalogue au-delà de ces deux-là** (pas d'extrapolation automatique à un futur programme crypto non vérifié).

## Action de suivi

`[À PLANIFIER]` : ajouter un contrôle du statut PSCA de Kraken et Meria à la revue trimestrielle de `docs/legal/textes/09-checklist-cgu-plateformes-ia.md`, ou créer une checklist crypto dédiée si le catalogue crypto s'étend au-delà de ces deux programmes.

---
**Sources** :
- [The AMF reminds Digital Asset Service Providers that the transitional period... ends on 1 July 2026 — AMF](https://www.amf-france.org/en/news-publications/news/amf-reminds-digital-asset-service-providers-transitional-period-allowing-them-continue-providing)
- [MERIA SAS — White list PSCA/PSAN — AMF](https://www.amf-france.org/en/warnings/white-lists/daspcasp/meria-sas)
- [Meria obtient la licence MiCA — Meria Academy](https://www.meria.com/academy/actualite-cryptomonnaies/meria-obtient-la-licence-mica)
- [La société crypto Meria d'Owen Simonin (Hasheur) obtient son agrément MiCA auprès de l'AMF — Cryptoast](https://cryptoast.fr/societe-crypto-meria-owen-simonin-hasheur-obtient-agrement-mica-aupres-amf/)
- [Kraken : avis, frais et régulation (PSAN / MiCA) 2026 — Ideal Investisseur](https://www.ideal-investisseur.fr/plateforme-crypto/kraken)
- [Liste plateforme crypto PSAN — Kraken](https://www.kraken.com/fr/learn/liste-plateforme-crypto-psan)
- [PSAN et MiCA : que faire avant la fin de la période transitoire du 1er juillet 2026 — Village Justice](https://www.village-justice.com/articles/psan-mica-que-faire-avant-fin-periode-transitoire-1er-juillet-2026,57455.html)
- Rappel du cadre général : `docs/legal/legal-strategy.md` §2c, §4bis (Code monétaire et financier art. L.54-10-4, L.572-23).
