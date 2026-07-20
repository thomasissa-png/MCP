<!-- Version: 2026-07-20 — @legal — Texte 2/11 checklist §7 : Politique de confidentialité RGPD -->

# Politique de confidentialité — Parrainly

**[À VÉRIFIER PAR UN JURISTE]** Draft de référence, calibré sur le flux de données réel documenté par `legal-strategy.md` §6 (V1 cercle fermé, un seul flux : tracking d'attribution).

*Dernière mise à jour : [DATE DE MISE EN LIGNE À COMPLÉTER]*

## 1. Qui sommes-nous

Parrainly est édité par [Thomas / Emmanuel / structure juridique à créer]. Le responsable de traitement des données personnelles collectées sur le Site est [MÊME ENTITÉ — à confirmer selon la structure juridique retenue].

## 2. Quelles données nous collectons (V1)

En V1 (cercle fermé, catalogue de fiches informatives), **une seule catégorie de données personnelles est traitée** : les données de suivi d'attribution, c'est-à-dire l'information technique permettant de relier le clic d'un utilisateur sur un lien de parrainage à une conversion éventuelle chez le programme tiers.

Concrètement : un identifiant unique inclus dans l'URL de redirection (`/r/{token}`), horodatage du clic, éventuellement adresse IP tronquée et informations techniques du navigateur (à des fins de mesure d'audience).

**Ce que nous ne collectons PAS en V1** : pas de compte utilisateur requis côté demandeur de code, pas d'identité civile, pas de coordonnées bancaires de tiers (le versement des primes de parrainage concerne uniquement les comptes personnels de Thomas et Emmanuel chez les programmes tiers, pas un flux géré par Parrainly).

## 3. Pourquoi nous traitons ces données (finalités et bases légales)

| Donnée | Finalité | Base légale RGPD |
|---|---|---|
| Identifiant de suivi (token de redirection) | Mesurer l'efficacité de la citation par un assistant IA et l'attribution de la conversion, calculer le KPI interne (parrainages confirmés d'origine IA) | Intérêt légitime (art. 6.1.f RGPD) : mesure d'audience agrégée, sans profilage individuel poussé |
| Cookies de mesure d'audience non essentiels (si utilisés) | Statistiques de navigation | Consentement (art. 6.1.a RGPD), recueilli via le bandeau cookies (voir `04-bandeau-cookies.md`) |

Nous ne couplons pas l'identifiant de suivi à l'identité civile du demandeur de code. Aucune décision automatisée à effet juridique n'est prise sur la base de ces données (pas de scoring, pas de recommandation personnalisée).

## 4. Durée de conservation

Les données de mesure d'audience/tracking sont conservées **13 mois maximum**, conformément à la recommandation de la CNIL, sauf obligation légale contraire.

## 5. Destinataires des données

Les données peuvent être traitées par nos sous-traitants techniques (hébergeur, outil de mesure d'audience — `[À COMPLÉTER selon le choix technique de @infrastructure/@data-analyst]`). Aucune donnée n'est vendue à des tiers. Aucun transfert hors Union européenne n'est prévu à ce stade `[À VALIDER selon l'hébergeur retenu]`.

## 6. Vos droits

Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité sur vos données. Pour l'exercer, contactez-nous à [ADRESSE EMAIL DE CONTACT] ou via le formulaire dédié `/rgpd/demande` (US-08). Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).

## 7. Cookies

Voir la politique cookies détaillée (`04-bandeau-cookies.md`) pour la liste des cookies utilisés et la gestion de votre consentement.

## 8. Sécurité

Nous mettons en œuvre les mesures techniques raisonnables pour protéger les données traitées contre l'accès non autorisé, la perte ou la divulgation. `[À VÉRIFIER PAR @infrastructure]` : détail des mesures à documenter une fois l'hébergement choisi.

## 9. Modification de la présente politique

Cette politique peut être mise à jour ; la version en vigueur est celle publiée sur le Site.

## 10. Contact et réclamation

[ADRESSE EMAIL DE CONTACT À COMPLÉTER]. Autorité de contrôle : CNIL, 3 Place de Fontenoy, 75007 Paris.

---
**Ce qui n'est PAS couvert par ce document (reporté à V2)** : le volet KYC des parrains tiers (collecte IBAN/identité pour verser des commissions) n'existe pas en V1 (2 parrains uniquement : Thomas et Emmanuel, sur leurs propres comptes). À instruire spécifiquement avant l'ouverture V2 de la marketplace, conformément à `legal-strategy.md` §9.

**Sources** : recommandation CNIL conservation 13 mois (mesure d'audience) ; base légale intérêt légitime/consentement reprise de `docs/legal/legal-strategy.md` §6. Aucune donnée inventée : champs entre crochets à compléter selon les choix techniques réels.
