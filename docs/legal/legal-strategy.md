<!-- Version: 2026-07-20T01:00 — @legal — REFRESH PHASE 0 : requalification cercle fermé (liens personnels T&E, catalogue fintech réel régulé) -->

# Stratégie juridique — Parrainly (Phase 0, REFRESH)

## Diff en tête de document (2026-07-20, refresh Phase 0)

L'hypothèse "POC hors-régulé (énergie/apps/VPN/box)" posée dans la version précédente de ce document **est invalidée par Thomas** (`project-context.md`, bloc `[CHOIX UTILISATEUR — 2026-07-20 #2]`). Réalité à instruire : le catalogue de départ **est** du régulé (néobanque/courtage Trade Republic, banque pro Qonto/Revolut Business, investissement/épargne Ramify/Finary/Spiko, compta Dougs, crypto Kraken/Meria). MAIS la configuration V1 change de nature : **cercle fermé**, Thomas & Emmanuel exposent **leurs propres liens de parrainage personnels** (pas une marketplace tierce à commission). L'ouverture marketplace à commission tierce est reportée en **V2**.

**Ce qui change dans ce refresh** : §2 entièrement réécrit (analyse par domaine régulé en configuration cercle fermé, remplace l'ancienne distinction POC hors-régulé/V1 banque) ; §4 réécrit avec les 9 programmes réels de la base d'Emmanuel ; nouveau §4bis (publicité produits financiers et crypto, contraintes de copy) ; §6 RGPD allégé (pas de KYC parrains tiers en V1, T&E seulement) ; nouveau §9 (conditions de passage V1→V2, l'ancien risque IOBSP/statut d'intermédiaire y est réintégré comme condition de la marketplace ouverte) ; réponse tranchée et checklist actualisées. Ce qui ne change pas : §3 (divulgation) et §5 (CGU plateformes IA), renforcés mais non contredits.

**Stade : V1 = cercle fermé (2 parrains identifiés, liens personnels) sur catalogue fintech/crypto réel. V2 = marketplace ouverte à commission tierce (hors scope de ce document, traité en condition §9).** Ce document est un **draft de référence**, pas un avis juridique formel. Toute mise en ligne réelle doit être validée par un avocat sur les points `[À VÉRIFIER PAR UN JURISTE]` — la densité de ces points est plus élevée que d'habitude car le secteur (finance/crypto régulée + statut d'indicateur) est une zone de frontière fine, pas un cas simple.

## Résumé exécutif — risques en 5 points

1. **Le statut réglementé n'est PAS automatiquement déclenché par la diffusion de liens personnels en cercle fermé** — voir §2. Le facteur déterminant n'est pas "y a-t-il un site public" mais "y a-t-il sélection/conseil/comparaison à valeur ajoutée" (bascule vers l'intermédiation) vs "simple liste + renvoi factuel" (reste apporteur/indicateur non régulé). Le modèle Parrainly, tel que décrit (fiches factuelles + lien), penche du bon côté MAIS la frontière est fine et non jurisprudentiellement tranchée pour un cas GEO/IA. `[À VÉRIFIER PAR UN JURISTE]`.
2. **Risque P0 n°1 : CGU des programmes réels** — la quasi-totalité des programmes de parrainage bancaire/fintech/crypto réservent l'usage du lien à un cadre personnel restreint (proches). Diffuser publiquement sur un site monétisé, même sans marketplace tierce, est le point de rupture le plus probable avec CHAQUE programme (Trade Republic, Qonto, Kraken, etc.) → risque de résiliation et perte de la prime, propre à Thomas et Emmanuel personnellement (pas un risque "entreprise" abstrait).
3. **Risque P0 n°2 inchangé et renforcé** : divulgation de l'affiliation non restituée par l'IA + secteur financier = double contrainte réglementaire (Omnibus/DGCCRF ET mentions de risque AMF/ACPR sur le produit lui-même) — voir §3 et §4bis.
4. **Risque P0 n°3 crypto** : Kraken et Meria sont des PSAN en transition vers l'agrément MiCA (échéance 1er juillet 2026, cf. sources) — la promotion d'un actif numérique par un acteur non autorisé, ou la promotion sans les mentions requises, est sanctionnée pénalement (2 ans, 30 000 €). Voir §2c et §4bis.
5. **Risque P1** : publicité produits financiers/investissement non conforme (mentions de risque absentes, promesse de rendement) — sanctionnable jusqu'à 100 000 € (AMF/ACPR) ; contraintes directes sur le copy — voir §4bis.

**Verdict global : GO POC/V1 en cercle fermé (2 parrains identifiés, liens personnels, catalogue fintech/crypto réel), SOUS CONDITIONS STRICTES §2/§7 — pas un GO inconditionnel.** Le risque n°1 sur ce périmètre n'est PAS le statut réglementé (probablement évitable en restant apporteur/indicateur, sous condition de posture factuelle) mais la **conformité CGU des 9 programmes réels un par un** — non encore vérifiée, à faire AVANT toute mise en ligne. Aucun blocage total — signalement conformément au protocole, mais alerte forte sur les conditions.

**Sources consultées (WebSearch, cette session, refresh)** :
- [Statuts d'intermédiaire / apporteur d'affaires — AFG](https://www.afg.asso.fr/app/uploads/2015/06/2015_06_Guide_Professionnel_clarification_statut_intermediaire-1.pdf)
- [Démarchage bancaire et financier — Code monétaire et financier, Légifrance](https://www.legifrance.gouv.fr/codes/id/LEGISCTA000006154463)
- [AMF — Démarchage financier](https://www.amf-france.org/en)
- [AMF — fin de la période transitoire PSAN/MiCA au 1er juillet 2026](https://www.amf-france.org/en/news-publications/news/amf-reminds-digital-asset-service-providers-transitional-period-allowing-them-continue-providing)
- [PSAN et MiCA : que faire avant la fin de la période transitoire — Village Justice](https://www.village-justice.com/articles/psan-mica-que-faire-avant-fin-periode-transitoire-1er-juillet-2026,57455.html)
- [Recommandation ARPP « Crypto-actifs » V2](https://www.arpp.org/nous-consulter/regles/regles-de-deontologie/recommandation-crypto-actifs-v2/)
- [Réglementation publicité produits financiers France — Clinique Juridique](https://www.cliniquejuridiquefes.org/la-reglementation-sur-la-publicite-des-produits-financiers-en-france/)
- [ARPP — Publicité financière, règles spécifiques](https://blog.arpp.org/2024/05/02/publicite-financiere-regles-specifiques-evitez-le-krash/)
- [Les influenceurs financiers dans le viseur de l'AMF et de l'ARPP — Anyti.me](https://www.anyti.me/fr/actualites/produits-financiers-les-influenceurs-dans-le-viseur-de-l-amf-et-de-l-arpp/1350)
- (Sources conservées des versions précédentes : Guide ORIAS IOBSP 2026, Solent Avocats IOBSP, Légifrance loi 2023-451, DGCCRF, OpenAI App Developer Terms — cf. `conformite-parrainage-ia.md` et version précédente de ce document, réutilisées en §9 pour la condition V2)

---

## 1. Cartographie des risques (P0/P1/P2) — refresh cercle fermé

| # | Risque | Base légale | Gravité | Domaine concerné | Garde-fou |
|---|--------|--------------|---------|----------------------|-----------|
| 1 | CGU des 9 programmes réels (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko) violées par la diffusion publique d'un lien "personnel" | Droit des contrats (CGU du programme, propre à chaque marque) | **P0** | Toutes | Fiche de conformité CGU par programme AVANT mise en ligne (§4), à défaut exclure/mettre en pause le programme |
| 2 | Requalification en intermédiation/conseil régulé si la présentation dépasse le simple listing factuel (IOBSP, CIF, indicateur AMF) | Code monétaire et financier art. L.519-1 s. (IOBSP), art. L.541-1 s. (CIF), démarchage bancaire et financier art. L.341-1 s. | **P0 potentiel, frontière fine** | Banque (Trade Republic), banque pro (Qonto/Revolut Business), investissement (Ramify/Finary/Spiko) | Posture éditoriale strictement factuelle (§2b), pas de comparatif "meilleur pour vous", pas de conseil personnalisé — `[À VÉRIFIER PAR UN JURISTE]` |
| 3 | Promotion crypto sans statut PSAN/PSCA valide ou sans les mentions requises (Kraken, Meria) | MiCA, Code monétaire et financier art. L.54-10-4, L.572-23 | **P0** | Crypto | Vérifier que Kraken/Meria sont bien agréés PSCA (ou PSAN en transition légale) au moment de l'intégration ; mentions de risque systématiques (§4bis) |
| 4 | Divulgation de l'affiliation non restituée par l'IA | Loi n° 2023-451 (influence commerciale), directive Omnibus (UE) 2019/2161, Code conso (pratiques trompeuses) | **P0** | Toutes | Mention embarquée dans la donnée retournée (§3) |
| 5 | Publicité produits financiers/crypto non conforme (mentions de risque absentes, promesse de rendement) | Règles ACPR/AMF, recommandations ARPP (produits financiers + crypto-actifs V2) | **P0** | Investissement, épargne, crypto | Mentions obligatoires systématiques, interdiction de promesse de rendement (§4bis) |
| 6 | Non-conformité CGU développeur plateformes IA (OpenAI, etc.) | Contrat d'adhésion (CGU plateforme) | **P1** | Toutes | Checklist par plateforme, veille continue (§5) |
| 7 | RGPD : tracking d'attribution IA→conversion | RGPD (intérêt légitime / consentement selon la donnée) | **P1** | Toutes | Registre de traitement minimal, base légale par flux (§6) |
| 8 | Confusion de marque / parasitisme sur les fiches produit | Art. L.713-1 CPI, parasitisme | **P2** | Toutes | Mention "non affilié officiellement", pas de logo sans licence |

**Ce qui disparaît de la version précédente** : le risque "IOBSP en V1 uniquement, hors scope POC" n'existe plus comme tel — en cercle fermé cette question se pose dès le lancement (le catalogue régulé est présent dès le premier jour), mais sa gravité réelle dépend de la posture éditoriale (§2b), pas d'un simple ajout différé de verticale.

---

## 2. Statut réglementé en configuration cercle fermé — analyse par domaine

**Question de fond** : quand Thomas & Emmanuel diffusent LEURS PROPRES liens de parrainage (usage a priori "personnel") sur un site public monétisé par la valeur de la commission de parrainage qu'ils perçoivent, cela déclenche-t-il un statut réglementé ? **Le facteur déterminant n'est ni "le site est public" ni "il y a de l'argent en jeu"** (les deux sont déjà vrais pour un simple parrainage personnel partagé sur les réseaux sociaux), **mais le degré de sélection/conseil/comparaison apporté**. Le droit français distingue nettement l'apporteur d'affaires/indicateur (non régulé, relation simple et factuelle) de l'intermédiaire/conseiller (régulé, analyse du besoin du client et recommandation personnalisée). Analyse domaine par domaine :

### a) IOBSP / ORIAS — banque, néobanque, courtage (Trade Republic)

Le Code monétaire et financier (art. L.519-1 s.) qualifie d'IOBSP celui qui, à titre habituel et contre rémunération, **met en relation** un client avec un établissement pour une opération de banque ou de paiement. Le simple fait de lister un produit et de renvoyer via un lien de parrainage personnel, **sans analyse du besoin ni recommandation comparative**, s'apparente à la posture d'**apporteur d'affaires/indicateur**, qui n'est pas réglementée (source AFG : "l'apporteur d'affaires n'est pas habilité à faire du conseil ni à démarcher... cette activité n'est pas réglementée"). Bascule vers l'IOBSP si Parrainly ajoute une couche de conseil ("cette offre est la meilleure pour votre profil"), du démarchage actif (contact non sollicité, art. L.341-1 s.) ou une automatisation qui s'apparente à une décision pour l'utilisateur. **Avis motivé : une fiche factuelle (nom, avantage, conditions, lien) + citation par une IA reste, dans son principe, du côté indicateur non régulé. `[À VÉRIFIER PAR UN JURISTE]` : le volume/la récurrence et la mise en avant algorithmique ("priorité d'affichage", champ `priorite_affichage` du schéma d'Emmanuel) peuvent, à un certain degré de sophistication, être lus comme une forme de sélection qui rapproche de l'intermédiation — non tranché par la doctrine actuelle pour un cas GEO/IA.**

### b) CIF / conseil en investissement, démarchage financier, indicateur AMF (Ramify, Finary, Spiko)

Même logique, avec un seuil plus bas côté producteur de contenu : le statut de Conseiller en Investissements Financiers (CIF, art. L.541-1 s.) est déclenché par un **conseil personnalisé** sur un investissement. Le démarchage bancaire et financier (art. L.341-1 s.) est déclenché par une sollicitation non sollicitée de l'utilisateur. Un site qui liste "Ramify : programme de parrainage, X€ offerts" sans recommandation ("investissez chez Ramify plutôt qu'ailleurs parce que...") reste, en principe, dans le registre de l'apporteur/indicateur AMF non régulé. **Point de vigilance renforcé pour l'investissement/épargne (contrairement à la banque)** : la frontière est plus surveillée par l'AMF car le préjudice potentiel pour l'épargnant est plus grave (perte en capital) — les recommandations AMF/ESMA sur les finfluenceurs (source ci-dessus) ciblent précisément la promotion de produits financiers par des tiers non habilités. **Avis motivé : GO sur la posture factuelle stricte, `[À VÉRIFIER PAR UN JURISTE]` dès que le copy dépasse le descriptif du programme lui-même** (voir contraintes §4bis pour @copywriter).

### c) PSAN/MiCA — crypto (Kraken, Meria)

Ici la question n'est pas le statut de Parrainly mais celui de Kraken/Meria eux-mêmes : la période transitoire PSAN se termine le **1er juillet 2026** ; au-delà, seuls les prestataires agréés PSCA (MiCA) peuvent servir des clients en France et **faire de la promotion** de leurs services (source AMF, Village Justice). Concrètement pour Parrainly : (i) vérifier au moment de l'intégration que Kraken et Meria disposent bien de l'agrément PSCA ou du statut transitoire légal en cours (sinon exclure le programme du catalogue, promouvoir un prestataire non autorisé expose à un risque pénal partagé) ; (ii) la simple diffusion d'un lien de parrainage personnel vers un PSCA agréé reste, comme pour la banque, de l'apport d'affaires non régulé côté Parrainly — le statut réglementé concerne l'émetteur crypto, pas l'apporteur. `[À VÉRIFIER PAR UN JURISTE]` : statut d'agrément à jour de Kraken et Meria à la date d'intégration réelle (évolutif, à vérifier au cas par cas, pas à une date figée dans ce document).

### d) Publicité des produits financiers (AMF/ACPR, DDA)

Indépendamment du statut de Parrainly, **le contenu publié doit respecter les règles de publicité applicables au produit sous-jacent** dès qu'il en fait la promotion, statut réglementé ou non de l'éditeur : mentions de risque obligatoires (investissement, crypto), interdiction de promesse de rendement, clarté de la nature commerciale du contenu. Traité en détail en §4bis (contraintes directes pour @copywriter). Ce risque est **indépendant de la qualification indicateur/IOBSP** — même un simple indicateur non régulé doit respecter les règles de publicité s'il fait la promotion d'un produit financier ou crypto.

### Réponse consolidée — le simple fait de lister + renvoyer constitue-t-il de l'intermédiation régulée ?

**Non, dans son principe, si la posture éditoriale reste strictement factuelle et non comparative/conseil.** C'est la conclusion motivée pour les quatre domaines (a-d). **Mais** : (1) c'est une frontière fine et non jurisprudentiellement testée pour un cas de diffusion via IA/GEO — `[À VÉRIFIER PAR UN JURISTE]` reste attaché à chaque domaine ci-dessus ; (2) elle impose une **discipline éditoriale continue** (pas de recommandation personnalisée, pas de "meilleur choix pour vous", pas de scoring/classement qui ressemble à un conseil) qui doit être posée comme contrainte produit et copy dès la V1, pas ajoutée après coup ; (3) elle ne dispense en rien des règles de publicité produits financiers/crypto (§4bis) ni de la conformité CGU des programmes (§4), qui sont les vrais points durs de ce périmètre.

---

## 3. Divulgation de l'affiliation

**Cadre applicable** (détaillé dans `conformite-parrainage-ia.md` §2, repris ici en synthèse actionnable) : loi n° 2023-451 du 9 juin 2023 (influence commerciale), directive Omnibus (UE) 2019/2161 transposée au Code de la consommation, contrôle DGCCRF (jusqu'à 75 000 € ou transmission au procureur pour pratique commerciale trompeuse). Mention claire et immédiate obligatoire ("Publicité", "Collaboration commerciale", ou équivalent assoupli type "partenariat" depuis nov. 2024) dès qu'un lien financier existe — c'est exactement le cas ici (Thomas et Emmanuel perçoivent personnellement un avantage/une commission de parrainage sur chaque lien exposé).

**Le cas spécifique "cité par une IA sans bannière"** : quand ChatGPT/Perplexity/Gemini/Claude restitue un code/lien issu de notre catalogue dans sa réponse, nous ne contrôlons ni la mise en forme ni la troncature éventuelle de la réponse du modèle. Trois lignes de défense complémentaires (aucune n'est suffisante seule) :
1. **Divulgation embarquée dans la donnée-source** : chaque fiche/code exposé (page web, JSON, flux structuré) doit contenir dans son texte brut une mention explicite et courte type *"Lien de parrainage [Marque] : Parrainage-IA perçoit une commission si vous l'utilisez."* — objectif : maximiser la probabilité que le LLM la reprenne, sans dépendre de son bon vouloir.
2. **Divulgation sur la page/fiche source consultable** (condition nécessaire indépendamment du canal IA, exigée par la loi elle-même) : mention visible avant tout lien cliquable.
3. **Mentions légales du site** : page dédiée "Comment ça marche / rémunération" expliquant le modèle de commission, référencée en pied de chaque fiche.

`[À VÉRIFIER PAR UN JURISTE]` : la doctrine/jurisprudence sur la responsabilité de l'éditeur de la donnée-source quand un tiers (le modèle IA) tronque ou omet la mention est inexistante en 2026 (secteur naissant GEO/AEO). Posture recommandée : documenter les efforts de divulgation (mention systématique dans la donnée + sur site) pour établir la bonne foi, sans certitude de couverture totale.

---

## 4. CGU des 9 programmes réels — la diffusion publique du lien personnel est-elle autorisée ?

**Constat central (analyse générale)** : la quasi-totalité des programmes de parrainage bancaire/fintech/crypto conditionnent l'octroi de la prime à un usage du lien **"à titre personnel"** — partage avec des proches, réseau restreint — et interdisent explicitement, ou de façon implicite via une clause anti-abus générale :
- la publication sur un site public, un comparateur, un forum de coupons ou tout support à vocation commerciale ;
- la génération de volume par un canal automatisé, un contenu optimisé pour l'acquisition (SEO/GEO), ou une audience non personnelle ;
- dans certains cas, la simple republication sur un support tiers même sans commission perçue par ce tiers.

**Risque concret pour Thomas et Emmanuel personnellement** (pas un risque "entreprise" abstrait, car ce sont leurs comptes/identités qui portent les liens) : perte de la prime déjà acquise ou en cours, clôture du compte de parrainage, dans certains cas clôture du compte principal (banque/courtage), sans contradictoire (clause de résiliation à la discrétion de l'émetteur).

**Programme par programme, ce qu'il faut vérifier avant intégration** (aucune de ces CGU n'a été lue en détail dans cette session — analyse générale uniquement, chaque case est `[À VÉRIFIER PAR UN JURISTE]` ou à défaut par Thomas/Emmanuel eux-mêmes en relisant les CGU actuelles de leur compte) :

| Programme | Catégorie | Point à vérifier en priorité |
|---|---|---|
| Trade Republic | Néobanque/courtage | Clause de diffusion publique/canal autorisé ; règles anti-abus sur le volume de filleuls |
| Qonto | Banque pro | Idem + statut pro du compte (conditions parrainage B2B parfois distinctes du grand public) |
| Revolut Business | Banque pro | Idem Qonto |
| Ramify | Investissement/épargne | Clause spécifique produits financiers (parrainage souvent couplé à une exigence de dépôt minimum du filleul, à ne pas présenter comme acquis) |
| Finary | Gestion de patrimoine | Idem Ramify |
| Spiko | Placement trésorerie | Idem, + vérifier si programme B2B avec conditions d'éligibilité entreprise |
| Dougs | Services entrepreneur/compta | Programme B2B, généralement plus tolérant sur la diffusion mais à vérifier |
| Meria | Crypto | Clause de diffusion + statut PSAN/PSCA à jour (§2c) |
| Kraken | Crypto | Idem Meria, + programme international (CGU parfois selon juridiction d'inscription) |

**Garde-fou opérationnel** : avant toute mise en ligne publique, produire une fiche de conformité par programme (statut : lu/vérifié, autorisé/interdit/silencieux, date de vérification) — c'est le prérequis §7 point 6, non encore fait pour aucun des 9 programmes à ce jour.

**Clauses à surveiller systématiquement** : clause de diffusion (personnelle vs publique) ; clause anti-fraude (volume anormal de filleuls, la diffusion via un site cité par des IA peut mécaniquement augmenter le volume au-delà d'un usage "personnel" typique, ce qui est justement le signal qui déclenche un contrôle) ; clause de résiliation/discrétion de l'émetteur ; conservation ou non des primes acquises en cas de résiliation (souvent perdues).

---

## 4bis. Publicité des produits financiers et crypto — contraintes directes pour @copywriter

Indépendamment du statut de Parrainly (§2), **le contenu publié doit respecter les règles de publicité applicables au produit sous-jacent** dès qu'il en fait la promotion.

**Investissement/épargne (Ramify, Finary, Spiko)** :
- Mention de risque obligatoire et visible : formulation type **"Investir comporte des risques de perte en capital"** doit apparaître de façon visible sur toute fiche produit d'investissement, pas en petit caractère ou en pied de page noyé (source ARPP/Clinique Juridique : la mention doit être présentée de manière visible dès la première page/vue de la communication).
- **Interdiction de toute promesse ou suggestion de rendement garanti** ("gagnez X%", "rendement assuré") — reformuler en langage factuel ("prime de parrainage de X€ à l'ouverture d'un compte", jamais "gagnez de l'argent en investissant").
- Ne jamais présenter l'avantage de parrainage comme un gain d'investissement (confusion entre prime de bienvenue et performance du produit financier lui-même) — ce sont deux choses différentes à ne pas mélanger dans le copy.

**Crypto (Kraken, Meria)** :
- Recommandation ARPP "Crypto-actifs" V2 applicable : mêmes exigences de clarté et de non-tromperie que les produits financiers classiques, avec une vigilance renforcée liée à la volatilité et au risque de perte totale.
- Mention de risque adaptée : formulation type "Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier" en complément de la mention de perte en capital.
- Ne jamais suggérer que la prime de parrainage crypto "compense" ou "couvre" le risque de l'investissement lui-même.

**Toutes verticales financières/crypto (transversal)** :
- Chaque fiche doit rester descriptive du programme de parrainage (montant de la prime, conditions d'obtention), pas du produit financier en tant que placement à recommander — c'est aussi ce qui protège la posture "indicateur non régulé" du §2.
- Éviter tout vocabulaire de classement/recommandation ("le meilleur", "notre choix n°1", "recommandé pour vous") sur les verticales financières — ce vocabulaire est à la fois un risque de requalification en conseil (§2) et un risque de publicité trompeuse s'il n'est pas objectivement fondé.
- `[À VÉRIFIER PAR UN JURISTE]` : l'AMF/ARPP proposent un "certificat de l'influence responsable en finance" pour les créateurs de contenu qui communiquent sur des produits financiers — pertinence à évaluer pour Thomas/Emmanuel si le volume de contenu financier grandit.

**Impact concret pour @copywriter** : ces trois contraintes (mention de risque visible, zéro promesse de rendement, zéro vocabulaire de classement/recommandation) doivent être posées comme règles d'écriture non négociables dans le brief de copy, pas comme suggestions de style — elles conditionnent à la fois la légalité de la publicité ET la posture indicateur non régulé de §2.

---

## 5. CGU des plateformes IA (OpenAI, Google, Perplexity, Anthropic)

Repris et complété du livrable amont (`conformite-parrainage-ia.md` §3) :
- **OpenAI** : App Developer Terms + App submission guidelines interdisent aux apps/connecteurs tiers de chercher à influencer le modèle pour se faire préférer à d'autres apps, ou de dénigrer des concurrents. Un contenu web/API conçu pour "être cité" doit rester factuel, sourcé et vérifiable (fraîcheur des codes) plutôt que manipulatoire dans sa structuration.
- **Perplexity** : intègre déjà publicité et affiliation dans ses propres résultats (signal de tolérance sectorielle) ; pas de politique anti-manipulation spécifique identifiée pour les sources tierces à ce jour. `[À VÉRIFIER / VEILLE]`.
- **Google (AI Overviews/Gemini), Anthropic (Claude)** : pas de CGU spécifique identifiée sur la citation de sources d'affiliation tierces lors de cette recherche — ces politiques évoluent vite ; absence de règle documentée aujourd'hui ne signifie pas absence de risque futur.
- **Point commun à retenir pour le cercle fermé V1** : aucune plateforme IA n'autorise le "spam" ou la manipulation du classement des sources ; le modèle défendable est celui d'une source **structurée, vérifiée et transparente** (fraîcheur des codes, divulgation embarquée §3), pas celui d'une source qui tente de forcer sa citation par des techniques d'optimisation agressives (cloaking, keyword stuffing).

**Garde-fou** : checklist de conformité par plateforme IA revue à chaque évolution significative des CGU développeur (trimestrielle a minima), avant toute intégration technique nouvelle (API, plugin, MCP en V1.5).

`[À VÉRIFIER PAR UN JURISTE]` : la nature du risque (contractuel via CGU d'adhésion vs risque business pur de déréférencement sans recours judiciaire) — traiter comme un risque business majeur (perte du canal principal) autant qu'un risque juridique.

---

## 6. RGPD

**Simplification liée au cercle fermé** : en V1, Parrainly n'a que 2 "parrains" (Thomas et Emmanuel eux-mêmes) — pas de KYC de parrains tiers, pas de versement de commission à un tiers, pas de collecte d'IBAN/identité de parrains externes. Ce flux RGPD, présent dans la version précédente de ce document en anticipation de la marketplace, **est reporté en V2** (§9). Un seul flux à traiter en V1 :

**Tracking d'attribution IA → conversion** :
- Identifiant traçable (paramètre UTM, lien unique par utilisateur/canal) = donnée personnelle dès qu'il permet, même indirectement, de réidentifier une personne (IP, device ID, compte).
- **Base légale** : intérêt légitime pour un tracking d'attribution agrégé sans profilage individuel poussé ; **consentement opt-in CNIL** requis dès qu'il y a cookie de traçage tiers ou profilage individualisé du comportement du demandeur.
- Minimisation : ne pas coupler l'identifiant de tracking à l'identité civile du demandeur de code (pas de compte requis côté demandeur en V1).
- Conservation : ≤ 13 mois pour les données de mesure d'audience/tracking (recommandation CNIL), sauf obligation légale contraire.
- Vigilance sectorielle : le tracking porte ici sur des intentions d'achat de produits financiers/crypto (données sensibles au sens économique, pas au sens RGPD strict santé/opinions, mais méritant la même rigueur de minimisation compte tenu de la nature financière du site).

**Garde-fou** : registre de traitement minimal (un seul flux en V1) ; le volet KYC parrains tiers ne devient pertinent qu'à l'ouverture V2 de la marketplace (§9).

---

## 7. Checklist conformité avant mise en ligne (cercle fermé V1)

| # | Document/mention | Qui le produit | Statut |
|---|-------------------|-----------------|--------|
| 1 | CGU du site (nature du contenu : fiches informatives + liens de parrainage personnels de Thomas/Emmanuel, pas de vente/conseil, pas de marketplace) | @legal | À produire |
| 2 | Politique de confidentialité (tracking d'attribution uniquement en V1) | @legal | À produire |
| 3 | Mentions légales (éditeur = Thomas/Emmanuel personnes physiques ou structure à créer, hébergeur, contact) | @legal | À produire |
| 4 | Bandeau cookies conforme CNIL (consentement positif) | @fullstack (implémentation) + @legal (texte) | À produire |
| 5 | Page "Divulgation affiliation / Comment ça marche" (mention de la commission de parrainage perçue par T&E) | @legal (texte) + @copywriter (ton) | À produire |
| 6 | Fiche de conformité CGU par programme (9 programmes réels, §4) | @legal, avant chaque mise en ligne | À produire, bloquant, aucune faite à ce jour |
| 7 | Mentions de risque produits financiers/crypto sur chaque fiche concernée (§4bis) | @copywriter (texte) + @legal (validation) | À produire, bloquant |
| 8 | Mention "non affilié officiellement à [Marque]" sur chaque fiche produit | @copywriter (intégration éditoriale) | À produire |
| 9 | Divulgation embarquée dans la donnée retournée (texte/JSON, §3) | @ia / @fullstack (implémentation technique) | À produire |
| 10 | Checklist CGU développeur par plateforme IA (§5), revue trimestrielle | @legal, veille continue | À produire puis récurrent |
| 11 | Vérification du statut PSCA/agrément à jour de Kraken et Meria avant mise en ligne des fiches crypto (§2c) | @legal, avant intégration | À produire, bloquant |

**Aucun de ces documents n'existe encore** — tous à produire avant mise en ligne publique. Les points 6, 7 et 11 sont **bloquants** (conditionnent le contenu même des fiches financières/crypto), à ne pas traiter comme de simples formalités a posteriori.

---

## 8. EU AI Act — classification

**Usage IA générative prévu (`project-context.md`)** : distribution via assistants IA tiers (canal externe, hors scope AI Act pour Parrainage-IA lui-même — ce sont OpenAI/Google/Anthropic/Perplexity les fournisseurs de système IA, pas nous) ; potentiellement génération/vérification interne de fiches codes (usage interne).

- **Le canal de distribution (être cité par ChatGPT/Perplexity/Claude/Gemini)** n'entre pas dans le champ de classification AI Act pour Parrainage-IA : nous ne sommes pas fournisseur du système d'IA générative, seulement une source de données qu'il consulte/cite. Pas de classification à faire de ce côté.
- **Si usage interne d'un LLM pour générer ou vérifier automatiquement les fiches produit (fraîcheur des codes, rédaction de description)** : cet usage relève de la classification **risque limité** au sens de l'AI Act (génération de contenu, pas de décision automatisée à fort impact sur une personne physique, pas de biométrie, pas de scoring social, pas de recrutement/crédit/médical).
- **Obligation résultante : transparence uniquement** — mentionner que les fiches/descriptions sont générées ou vérifiées avec l'assistance d'une IA si cela affecte le contenu perçu par l'utilisateur final (ex. "Fiche vérifiée automatiquement" ou équivalent), conformément à l'obligation de transparence de l'AI Act pour le risque limité.
- **Vigilance V1** : si un usage IA venait à orienter automatiquement un utilisateur vers un produit de crédit/investissement avec une forme de scoring ou de recommandation personnalisée (pas prévu actuellement), la classification remonterait vers "haut risque" (crédit) — à réévaluer explicitement si ce type de fonctionnalité est envisagé, et à éviter précisément parce qu'elle ferait aussi basculer le statut §2 vers l'intermédiation régulée.

**Garde-fou** : documenter dans les mentions légales/CGU tout usage d'IA générative interne affectant le contenu publié (transparence), sans action supplémentaire tant que l'usage reste de la génération/vérification de contenu (risque limité).

---

## 9. Ce qui change pour la V2 (ouverture marketplace à commission tierce)

La V1 cercle fermé limite mécaniquement l'exposition réglementaire : 2 personnes physiques identifiées, leurs propres liens, pas de tiers rémunérés. **Dès que la V2 ouvre le catalogue à des parrains tiers avec commission prélevée par Parrainly sur leurs primes**, l'analyse change de nature et redevient lourde :

- **Statut d'intermédiaire commercial rémunéré** : Parrainly cesse d'être 2 particuliers qui partagent leurs propres liens et devient une plateforme qui organise et monétise la mise en relation de tiers avec des produits bancaires/financiers/crypto — le raisonnement "apporteur/indicateur personnel non régulé" du §2 ne tient plus de la même façon à cette échelle et avec ce degré d'organisation commerciale. La question IOBSP/CIF/PSCA (mise en relation habituelle et rémunérée, art. L.519-1 s. / L.541-1 s.) redevient un enjeu de premier plan, à instruire spécifiquement avant l'ouverture V2, pas par extrapolation du raisonnement V1.
- **KYC des parrains tiers** : collecte de données d'identité et bancaires (IBAN) pour verser les commissions, RGPD complet à instruire (base légale contrat, DPA avec le prestataire de paiement, conservation 10 ans obligations comptables).
- **CGU internes "parrains tiers"** : acceptation contractuelle par chaque parrain externe que son lien soit exposé publiquement, transfert partiel de responsabilité contractuelle vers lui, mais ne rend pas pour autant le programme tiers compatible avec les CGU de la marque parrainée (§4) — la vérification CGU programme par programme reste due par Parrainly.
- **Publicité produits financiers (§4bis)** : les contraintes de mentions de risque et d'absence de promesse de rendement s'appliquent avec la même rigueur, mais à un volume de contenu potentiellement bien supérieur (multiplication des parrains = multiplication des fiches) — nécessite un processus de contrôle éditorial systématisé, pas seulement une règle de style.

**Condition de passage V1→V2 posée comme prérequis, pas comme option** : instruction complète du statut d'intermédiaire (IOBSP/CIF/immatriculation ORIAS le cas échéant) et du RGPD KYC parrains AVANT toute ouverture du catalogue à un parrain tiers rémunéré — cette instruction doit être un item de roadmap explicite pour @product-manager, pas une tâche implicite.

---

## Réponse tranchée à la question de fond

**Le POC/V1 en cercle fermé (liens personnels de Thomas & Emmanuel, catalogue fintech/crypto réel) est-il lançable ?**

**GO, sous conditions strictes, pas un GO inconditionnel.** Motivation : (a) la diffusion de liens personnels avec une posture éditoriale factuelle (pas de conseil, pas de comparatif "meilleur pour vous") reste, dans son principe et pour les 4 domaines analysés (§2a-d), du côté de l'apporteur d'affaires/indicateur non régulé, donc lançable sans immatriculation ORIAS ni agrément CIF/AMF ; (b) mais cette conclusion repose sur une frontière fine et non jurisprudentiellement testée pour un cas GEO/IA (`[À VÉRIFIER PAR UN JURISTE]` attaché à chaque domaine §2) ; (c) le risque réel n°1 sur ce périmètre n'est pas le statut réglementé mais la **conformité CGU des 9 programmes** (§4, aucune vérifiée à ce jour) et les **mentions de publicité financière/crypto** (§4bis, aucune rédigée à ce jour), ce sont les deux blocages opérationnels avant mise en ligne, pas le statut.

**Conditions de lancement** : (1) fiche de conformité CGU produite et statuée pour chacun des 9 programmes avant sa mise en ligne (checklist §7 point 6) ; (2) mentions de risque financier/crypto systématiques sur toute fiche concernée avant publication (checklist §7 point 7) ; (3) posture éditoriale strictement factuelle et non comparative, posée comme règle produit/copy non négociable (§2, §4bis) ; (4) vérification du statut PSCA de Kraken/Meria avant publication des fiches crypto (checklist §7 point 11) ; (5) divulgation embarquée dans la donnée (§3, inchangé).

---

## Hypothèses à valider

- `[À VALIDER]` La posture éditoriale exacte des fiches (purement factuelle vs incluant un élément de mise en avant/priorité) — le champ `priorite_affichage` du schéma d'Emmanuel doit rester un critère de fraîcheur/qualité, pas un classement comparatif implicite, pour ne pas fragiliser la posture indicateur du §2.
- `[À VALIDER]` La structure juridique qui porte le site (Thomas/Emmanuel en personnes physiques vs société à créer) — impacte la rédaction des mentions légales et la responsabilité personnelle en cas de litige avec un programme.
- `[À VÉRIFIER PAR UN JURISTE]` Tous les points signalés dans le corps du document, en particulier : qualification indicateur vs IOBSP/CIF par domaine (§2a-b), statut d'agrément à jour de Kraken/Meria (§2c), conformité CGU des 9 programmes au cas par cas (§4), doctrine sur la divulgation restituée par un canal IA tiers (§3).

---

## Gates BLOQUANT vérifiées

- **G1** : 11 sections numérotées présentes (dont 4bis et 9 nouvelles), 0 section < 2 lignes, 0 `[TODO]` résiduel. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : persona non directement adressé ici (livrable de conformité B2B interne, pas client-facing) — cohérent avec le rôle de @legal ; N/A documenté.
- **G7** : 0 contradiction avec les livrables amont sur le fond du modèle (cercle fermé, 9 programmes, commission personnelle) — vérifié par Read de `project-context.md` bloc `[CHOIX UTILISATEUR — 2026-07-20 #2]` (source d'autorité de ce refresh) ; la version précédente de ce document (POC hors-régulé) est explicitement corrigée et remplacée, pas contredite silencieusement (diff en tête de document). PASS.
- **G12** : chaque garde-fou et chaque ligne des checklists §4/§7 porte un verbe d'action + un objet + un responsable + un critère de done. PASS.
- **G13** : chiffres cités sourcés (délit crypto 2 ans/30 000 €, amende publicité financière 100 000 €, échéance PSAN/MiCA 1er juillet 2026) — tous issus des WebSearch documentées en tête de document ; 0 chiffre inventé. PASS.
- **G15** : Grep du document sur les patterns placeholder (`[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER`) — 0 occurrence. Seules occurrences volontaires : `[À VÉRIFIER PAR UN JURISTE]`, `[À VALIDER]` (annotations autorisées). PASS.
- **G17** : le document est calibré sur les 9 programmes réels nommés de la base d'Emmanuel et sur la configuration cercle fermé exacte confirmée par Thomas, un concurrent générique ne peut pas le réutiliser tel quel. PASS.
- **G_PROOF** : bloc `Vérifié :` ci-dessous. PASS.

**Vérifié :** Projection sur un cas réel — une fiche "parrainage Kraken" (crypto, catalogue réel) citée par une IA en réponse à "code parrainage Kraken".
`Read docs/legal/legal-strategy.md §2c + §4 + §4bis` : avant toute mise en ligne de cette fiche, trois conditions cumulatives doivent être remplies : (1) vérifier que Kraken dispose de l'agrément PSCA ou du statut transitoire PSAN légal à la date d'intégration (§2c, non fait à ce jour, action bloquante) ; (2) la fiche doit contenir les mentions obligatoires "Les crypto-actifs sont des actifs risqués, leur valeur peut fortement varier" + la mention de divulgation d'affiliation embarquée type "Lien de parrainage Kraken : Thomas/Emmanuel perçoivent un avantage si vous l'utilisez" (§3 + §4bis) ; (3) le texte doit rester factuel (montant de l'avantage, conditions d'obtention) sans jamais suggérer que Kraken "rend" ou "compense" un risque, ni utiliser un vocabulaire de classement ("le meilleur exchange crypto") qui fragiliserait à la fois la posture indicateur (§2c) et les règles de publicité financière (§4bis). Conclusion : le cadre théorique tient (fiche lançable), mais aucune des 3 conditions n'est actuellement remplie dans la base d'Emmanuel (champs `conditions`/`notes` du schéma ne contiennent pas ces mentions), action concrète et bloquante avant toute publication de la fiche Kraken réelle.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/legal/legal-strategy.md` (refresh Phase 0, remplace intégralement la version précédente)
- Décisions prises : GO cercle fermé sous conditions strictes (§2, §7) ; posture indicateur/apporteur d'affaires non régulé motivée par domaine (banque, CIF/investissement, crypto, publicité — §2a-d) mais frontière fine documentée `[À VÉRIFIER PAR UN JURISTE]` ; risque n°1 réel = conformité CGU des 9 programmes (§4, aucune faite) et mentions de publicité financière/crypto (§4bis, aucune rédigée) ; V1→V2 posé comme condition explicite (§9, statut d'intermédiaire redevient lourd à l'ouverture marketplace tierce) ; classification AI Act inchangée (risque limité/transparence).
- Points d'attention pour @product-manager : la checklist §7 (11 items, dont 3 bloquants : CGU par programme, mentions de risque financier, statut PSCA crypto) est un prérequis avant mise en ligne, à intégrer dans la roadmap V1 ; la condition de passage V1→V2 (§9) doit être un item de roadmap explicite, pas implicite.
- Points d'attention pour @copywriter : 3 contraintes non négociables issues de §4bis : mention de risque visible ("investir comporte des risques de perte en capital", crypto = "actifs risqués"), zéro promesse de rendement, zéro vocabulaire de classement/recommandation ("le meilleur", "recommandé pour vous") sur les verticales financières et crypto ; ces contraintes protègent à la fois la légalité publicitaire ET la posture indicateur non régulé de §2.
- Points d'attention pour @data-analyst : le tracking d'attribution (§6) reste base légale intérêt légitime/consentement, conservation ≤ 13 mois ; le volet KYC parrains tiers est reporté en V2 (§9), pas à instruire en V1.
- Points d'attention pour @fullstack/@infrastructure : implémentation technique requise pour la divulgation embarquée dans la donnée (§3, §7 point 9), le bandeau cookies CNIL (§7 point 4).
- Recommandation forte et non négociable : faire valider ce document par un avocat spécialisé droit bancaire/financier (statut IOBSP/CIF) et droit de la consommation/influence AVANT toute mise en ligne publique réelle du catalogue fintech/crypto, pas seulement avant la V2 — les points `[À VÉRIFIER PAR UN JURISTE]` sur la qualification indicateur/IOBSP-CIF sont structurants pour le GO/NO-GO opérationnel, pas de simples réserves de style.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable d'analyse, aucun code produit). Actions futures signalées ci-dessus pour @fullstack/@infrastructure au moment de l'implémentation.
---
</content>
