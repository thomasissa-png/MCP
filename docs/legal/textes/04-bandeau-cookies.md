<!-- Version: 2026-07-20 — @legal — Texte 4/11 checklist §7 : Bandeau cookies conforme CNIL + politique cookies -->

# Bandeau cookies et politique cookies Parrainly

**[À VÉRIFIER PAR UN JURISTE]** Texte conforme aux lignes directrices CNIL sur les cookies (consentement positif, refus aussi simple que l'acceptation). Implémentation technique à la charge de @fullstack (voir points d'attention en fin de fichier).

## A. Texte du bandeau (à afficher au premier chargement)

> **Nous utilisons des cookies**
> Parrainly utilise des cookies de mesure d'audience pour comprendre comment vous arrivez sur nos fiches (notamment depuis un assistant IA) et améliorer le service. Certains cookies sont nécessaires au fonctionnement du site ; d'autres nécessitent votre accord.
>
> [Tout accepter] [Tout refuser] [Personnaliser mes choix]

**Exigences CNIL non négociables** (à respecter dans l'implémentation) :
- Les 3 boutons doivent être **de visibilité et de facilité d'action équivalentes** : "Tout refuser" ne doit pas être un lien discret en petit caractère alors que "Tout accepter" est un gros bouton coloré.
- **Aucun cookie non essentiel ne doit être déposé avant l'action positive de l'utilisateur** (pas de tracking par défaut, opt-in strict).
- Le refus doit être aussi facilement réversible que l'acceptation (accès à "Personnaliser mes choix" à tout moment via un lien en pied de page).
- Renouvellement du recueil du consentement tous les 6 mois maximum (recommandation CNIL) `[À VALIDER par @infrastructure lors de l'implémentation]`.

## B. Catégories de cookies (pour le panneau "Personnaliser mes choix")

| Catégorie | Exemples | Nécessite un consentement ? |
|---|---|---|
| Cookies strictement nécessaires | Session technique, panier `/r/{token}` (redirection) | Non (exemptés CNIL, finalité strictement technique) |
| Mesure d'audience (si non exemptée) | Outil analytics choisi par @data-analyst (Plausible/PostHog) | Selon configuration : Plausible en mode "cookieless" peut être exempté ; PostHog avec cookie tiers nécessite consentement. `[À VÉRIFIER PAR @infrastructure/@data-analyst selon la configuration technique retenue]` |
| Cookies tiers de partage social (si ajoutés) | Boutons de partage réseaux sociaux | Oui |

## C. Politique cookies détaillée (page dédiée liée au bandeau)

**Qu'est-ce qu'un cookie ?** Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite, qui permet de reconnaître votre navigateur lors de visites ultérieures.

**Quels cookies utilisons-nous ?** Voir tableau ci-dessus. La liste exacte des cookies déposés (nom technique, durée de vie, éditeur) sera complétée par @infrastructure/@fullstack au moment de l'implémentation technique (`[DONNÉE MANQUANTE, à compléter après choix technique définitif]`).

**Comment gérer vos préférences ?** Via le lien "Gérer mes cookies" présent en pied de page à tout moment, ou via les paramètres de votre navigateur.

**Durée de conservation du consentement** : 6 mois, au-delà desquels le bandeau réapparaît.

---
**Points d'attention pour @fullstack** (implémentation technique) :
1. Bloquer techniquement le chargement de tout script de mesure d'audience/tiers tant que le consentement positif n'est pas recueilli (pas seulement masquer le bandeau).
2. Stocker le choix de l'utilisateur (accepté/refusé/catégories) et le proposer au renouvellement après 6 mois.
3. Le bouton "Tout refuser" doit être au même niveau visuel que "Tout accepter" (contrainte CNIL, pas une recommandation UX optionnelle).

**Sources** : recommandations CNIL sur les cookies et traceurs (consentement positif, équivalence des choix, durée 6 mois) ; principe repris de `docs/legal/legal-strategy.md` §6 et du référentiel légal (voir prompt agent §"Référentiels").
