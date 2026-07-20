<!-- Version: 2026-07-20T00:00 — @legal — Stratégie de conformité Phase 0 (marketplace parrainage à rotation, POC hors-régulé + trajectoire V1 banque) -->

# Stratégie juridique — Parrainage-IA (Phase 0)

**Stade : POC hors-régulé → V1 banque/fintech régulée.** Ce document est un **draft de référence**, pas un avis juridique formel. Il approfondit et structure `docs/legal/conformite-parrainage-ia.md` (analyse initiale) à la lumière du cadrage confirmé par Thomas : **marketplace à rotation de parrains, commission sur les primes, verticales POC hors-régulé (énergie/apps/VPN/box/e-commerce), verticales V1 banque/fintech (régulé)**. Toute mise en ligne réelle doit être validée par un avocat sur les points `[À VÉRIFIER PAR UN JURISTE]`.

## Résumé exécutif — risques en 5 points

1. **Le POC hors-régulé (énergie, apps, VPN, box, e-commerce) est lançable SANS statut réglementé** — voir §2. Ce sont des secteurs non couverts par le monopole bancaire/financier ; le risque principal y est contractuel (CGU des programmes), pas réglementaire.
2. **Risque P0 n°1 inchangé et aggravé par la commission** : diffuser/inciter à la diffusion de liens de parrainage tiers en marketplace ouverte viole quasi-systématiquement les CGU des programmes (diffusion "à titre personnel" uniquement) → résiliation + perte des primes, sans recours. Prendre une **commission** sur ce flux renforce le caractère commercial et donc le risque de requalification (activité d'intermédiation commerciale non autorisée par le programme).
3. **Risque P0 n°2 inchangé** : la divulgation de l'affiliation doit être embarquée dans la donnée elle-même, car l'IA ne restitue pas de bannière — zone réglementaire non stabilisée (2026).
4. **Risque P0 n°3 nouveau (V1 banque)** : promouvoir des produits bancaires/fintech avec commission = très probablement une activité d'intermédiaire en opérations de banque (IOBSP), soumise à immatriculation ORIAS obligatoire — exercer sans immatriculation est un **délit pénal** (2 ans, 300 000 €). Ce risque est HORS scope POC (verticales non bancaires) mais BLOQUANT pour la V1 si non traité en amont.
5. **Risque P1** : CGU développeur des plateformes IA + RGPD sur le KYC des parrains (marketplace = collecte de données bancaires/identité pour verser les commissions).

**Verdict global : GO POC sur les verticales hors-régulé sans statut réglementé, sous réserve des garde-fous §7. V1 banque = statut IOBSP + ORIAS + veille ACPR/AMF à instruire avant tout élargissement — ne pas ouvrir le catalogue banque avant.** Aucun blocage — signalement conformément au protocole.

**Sources consultées (WebSearch, cette session)** :
- [Guide inscription IOBSP ORIAS 2026](https://www.orias.rest/blog/guide-inscription-iobsp-2026)
- [IOBSP : obligations légales et jurisprudentielles — Solent Avocats](https://solent-avocats.com/intermediaires-en-operations-de-banque-et-services-de-paiement-iobsp-guide-complet-de-leurs-obligations-legales-et-jurisprudentielles/)
- [ORIAS 2026 : inscription, renouvellement, sanctions — Prestimonia](https://www.prestimonia.com/blog/orias-inscription-renouvellement-sanctions-guide-cgp)
- [AMF/ARPP — Certificat de l'influence responsable en finance](https://www.amf-france.org/en/news-publications/news-releases/amf-news-releases/amf-and-arpp-launch-responsible-influence-certificate-finance)
- [Recommandations AMF/ESMA finfluenceurs — La finance pour tous](https://www.lafinancepourtous.com/2026/01/22/finfluenceurs-recommandations-de-lamf-et-de-lesma-pour-une-promotion-responsable/)
- [Recommandation ARPP — Produits et services financiers et d'investissement](https://www.arpp.org/nous-consulter/regles/regles-de-deontologie/produits-et-services-financiers-et-d-investissement/)
- (Sources conservées du livrable amont : Légifrance loi 2023-451, DGCCRF/economie.gouv.fr, OpenAI App Developer Terms — cf. `conformite-parrainage-ia.md`)

---

## 1. Cartographie des risques (P0/P1/P2)

| # | Risque | Base légale | Gravité | Verticale concernée | Garde-fou |
|---|--------|--------------|---------|----------------------|-----------|
| 1 | Diffusion publique/incitée de liens de parrainage en violation des CGU des programmes, aggravée par la commission marketplace | Droit des contrats (CGU du programme, pas de loi spécifique) | **P0** | Toutes (POC + V1) | Fiche CGU par programme avant intégration ; exclure les programmes qui interdisent explicitement la diffusion tierce/commerciale |
| 2 | Divulgation de l'affiliation non restituée par l'IA | Loi n° 2023-451 (influence commerciale), directive Omnibus (UE) 2019/2161, Code conso (pratiques trompeuses) | **P0** | Toutes | Mention embarquée dans la donnée retournée (voir §3) |
| 3 | Exercice non autorisé d'activité d'IOBSP sur les verticales bancaires (V1) sans immatriculation ORIAS | Code monétaire et financier (art. L.519-1 s.) | **P0 (V1 uniquement, pas POC)** | Banque/fintech | Immatriculation ORIAS avant tout ajout de programme bancaire au catalogue — voir §2 |
| 4 | Non-conformité CGU développeur plateformes IA (OpenAI, etc.) | Contrat d'adhésion (CGU plateforme) | **P1** | Toutes | Checklist par plateforme, veille continue |
| 5 | RGPD : tracking d'attribution IA→conversion + KYC parrains (IBAN, identité) | RGPD (intérêt légitime / contrat / consentement selon la donnée) | **P1** | Toutes | Registre de traitement minimal, séparation identifiant/identité, base légale par flux (§6) |
| 6 | Publicité financière non conforme (V1) : absence de mention obligatoire, ciblage trompeur d'un produit financier | Règles ACPR/AMF, codes ARPP produits financiers (en vigueur depuis le 1er oct.) | **P0 (V1 uniquement)** | Banque/fintech | Certificat influence responsable finance (AMF/ARPP) recommandé avant toute fiche produit bancaire, mentions obligatoires |
| 7 | Confusion de marque / parasitisme sur les fiches produit | Art. L.713-1 CPI, parasitisme | **P2** | Toutes | Mention "non affilié officiellement", pas de logo sans licence |
| 8 | Programmes crypto/actifs numériques | Art. L.222-16-2 Code conso | **P2** | Hors scope POC/V1 déclaré | Exclure du catalogue au démarrage |

---

## 2. Statut d'intermédiaire — POC hors-régulé vs V1 banque/fintech

**Nature de l'activité** : marketplace à rotation de parrains qui prend une **commission sur les primes de parrainage générées** = intermédiation commerciale rémunérée. Le statut applicable dépend strictement de la nature du produit sous-jacent, pas du mécanisme marketplace lui-même.

### POC hors-régulé (énergie type EDF, apps, VPN, box, e-commerce)

Aucun de ces secteurs ne relève d'un monopole réglementé de type bancaire/financier/assurantiel. Prendre une commission sur des primes de parrainage énergie/VPN/app/box/e-commerce s'analyse comme de **l'affiliation/apport d'affaires commercial classique** (même mécanique que Dealabs, iGraal, ComparaBanques sur leurs verticales non financières) :
- **Pas de statut réglementé requis** (pas d'ORIAS, pas d'agrément AMF/ACPR) pour ces verticales.
- Le risque reste **contractuel** (CGU des programmes, §1 risque n°1), pas réglementaire.
- Réserve sectorielle : le secteur de l'énergie a ses propres règles de démarchage (Code de l'énergie, méd. national de l'énergie) essentiellement sur le démarchage physique/téléphonique — non directement applicables à un simple relais de lien de parrainage en ligne, mais à surveiller si le modèle évolue vers du démarchage actif. `[À VÉRIFIER PAR UN JURISTE]`.

### V1 banque/fintech (régulé)

Dès qu'un programme de parrainage bancaire/fintech (compte courant, crédit, carte, néobanque) entre au catalogue avec commission, l'analyse change :
- **IOBSP (Intermédiaire en Opérations de Banque et Services de Paiement)** : la mise en relation rémunérée d'un client avec un établissement de crédit/paiement, à titre habituel, relève en principe du statut IOBSP (Code monétaire et financier, art. L.519-1 s.). **Immatriculation ORIAS obligatoire avant tout démarrage de l'activité** — l'exercice sans immatriculation est un délit pénal (2 ans d'emprisonnement, 300 000 € d'amende).
- **Nuance "apporteur/indicateur"** : un simple indicateur qui met en relation sans conseil ni analyse du besoin du client peut, selon certaines lectures, échapper au statut IOBSP et être rémunéré via une "commission d'apport" simple ; un délai de mise en conformité de 6 mois existe après franchissement de seuil. **Cette frontière indicateur/IOBSP est fine et dépend du degré d'accompagnement (simple lien vs comparaison/conseil)** — le modèle "meilleur parrainage pour X" avec sélection/mise en avant s'approche plus de l'intermédiation que du simple lien. `[À VÉRIFIER PAR UN JURISTE — qualification précise à trancher avant la V1]`.
- **Publicité financière (ACPR/AMF/ARPP)** : si le catalogue expose des produits d'investissement/crédit avec formulation incitative, les codes ARPP "produits et services financiers et d'investissement" s'appliquent (mentions obligatoires, pas de promesse de gain trompeuse). L'AMF/ARPP proposent un "certificat de l'influence responsable en finance" pour les acteurs qui communiquent sur ces produits — recommandé avant toute fiche produit bancaire publiée.
- **Conséquence pratique** : la V1 banque ne peut pas se limiter à "ajouter EDF-like des banques au même catalogue" — elle nécessite un chantier réglementaire dédié (immatriculation ORIAS, éventuellement mandat/convention avec les établissements, conformité publicité) AVANT ouverture.

### Réponse tranchée

**Le POC hors-régulé (énergie, apps, VPN, box, e-commerce) est-il lançable sans statut réglementé ?**

**OUI.** Aucune de ces verticales ne requiert d'immatriculation ORIAS ni d'agrément AMF/ACPR : ce sont des secteurs de commerce/affiliation classique. Le risque à gérer sur le POC est le respect des CGU de chaque programme de parrainage (§1 n°1) et la divulgation (§1 n°2), pas un statut réglementé. **Condition** : ne pas inclure de programme bancaire/fintech/assurance/crypto au catalogue avant que le chantier IOBSP/ORIAS de la V1 soit instruit et tranché — c'est la frontière de sécurité entre POC et V1.

---

## 3. Divulgation de l'affiliation

**Cadre applicable** (détaillé dans `conformite-parrainage-ia.md` §2, repris ici en synthèse actionnable) : loi n° 2023-451 du 9 juin 2023 (influence commerciale), directive Omnibus (UE) 2019/2161 transposée au Code de la consommation, contrôle DGCCRF (jusqu'à 75 000 € ou transmission au procureur pour pratique commerciale trompeuse). Mention claire et immédiate obligatoire ("Publicité", "Collaboration commerciale", ou équivalent assoupli type "partenariat" depuis nov. 2024) dès qu'un lien financier existe — c'est exactement le cas ici (commission marketplace sur les primes).

**Le cas spécifique "cité par une IA sans bannière"** : quand ChatGPT/Perplexity/Gemini/Claude restitue un code/lien issu de notre catalogue dans sa réponse, nous ne contrôlons ni la mise en forme ni la troncature éventuelle de la réponse du modèle. Trois lignes de défense complémentaires (aucune n'est suffisante seule) :
1. **Divulgation embarquée dans la donnée-source** : chaque fiche/code exposé (page web, JSON, flux structuré) doit contenir dans son texte brut une mention explicite et courte type *"Lien de parrainage [Marque] : Parrainage-IA perçoit une commission si vous l'utilisez."* — objectif : maximiser la probabilité que le LLM la reprenne, sans dépendre de son bon vouloir.
2. **Divulgation sur la page/fiche source consultable** (condition nécessaire indépendamment du canal IA, exigée par la loi elle-même) : mention visible avant tout lien cliquable.
3. **Mentions légales du site** : page dédiée "Comment ça marche / rémunération" expliquant le modèle de commission, référencée en pied de chaque fiche.

`[À VÉRIFIER PAR UN JURISTE]` : la doctrine/jurisprudence sur la responsabilité de l'éditeur de la donnée-source quand un tiers (le modèle IA) tronque ou omet la mention est inexistante en 2026 (secteur naissant GEO/AEO). Posture recommandée : documenter les efforts de divulgation (mention systématique dans la donnée + sur site) pour établir la bonne foi, sans certitude de couverture totale.

---

## 4. CGU des programmes de parrainage tiers — compatibilité avec la diffusion marketplace

**Constat central** : la quasi-totalité des programmes de parrainage (bancaire, VPN, énergie, apps) réservent contractuellement l'usage du lien à une diffusion **"à titre personnel"** (proches, réseau restreint) et interdisent explicitement :
- la publication sur un site public, forum de coupons, comparateur ou marketplace tiers ;
- l'incitation commerciale à l'usage du lien (rémunération, avantage en échange du partage) ;
- la revente ou la sous-commission du lien à un tiers.

**Est-ce compatible avec le modèle marketplace à rotation ?** Cela dépend intégralement de la lecture des CGU **de chaque programme individuellement** — il n'existe pas de règle générale unique. Trois cas de figure :
1. **Programme qui interdit explicitement toute diffusion publique/tierce** → incompatible, à exclure du catalogue tant que le programme ne l'autorise pas.
2. **Programme silencieux ou ambigu** → zone grise, risque résiduel (résiliation à la discrétion de l'émetteur) ; `[À VÉRIFIER PAR UN JURISTE]` au cas par cas avant intégration à grande échelle.
3. **Programme avec un volet "partenaire/affilié" officiel distinct du parrainage grand public** (ex. programmes d'affiliation dédiés proposés par certaines marques) → c'est la voie la plus sûre : privilégier l'intégration des marques qui offrent un programme d'affiliation officiel plutôt que de republier des liens de parrainage personnels non prévus pour cet usage.

**Clauses à surveiller systématiquement lors de la fiche de conformité par programme (garde-fou §7)** :
- Clause de diffusion (personnelle vs publique/tierce autorisée ou non).
- Clause de rémunération/commission tierce (interdiction de sous-commissionner).
- Clause anti-fraude (détection de volume anormal de filleuls, risque accru par la rotation marketplace qui mécaniquement augmente les volumes par parrain).
- Clause de résiliation/discrétion de l'émetteur (quasi toujours à la seule discrétion du programme, sans contradictoire).
- Durée de conservation des primes acquises en cas de résiliation (souvent perdues, non dues).

**Garde-fou marketplace spécifique à la rotation** : documenter pour chaque parrain inscrit qu'il a lu et accepté que son lien puisse être exposé publiquement via la plateforme (clause dans les CGU internes des "parrains", §7) — cela ne rend pas le programme tiers compatible, mais transfère la responsabilité contractuelle de vérification au parrain lui-même en complément de la fiche de conformité produite par Parrainage-IA.

---

## 5. CGU des plateformes IA (OpenAI, Google, Perplexity, Anthropic)

Repris et complété du livrable amont (`conformite-parrainage-ia.md` §3) :
- **OpenAI** : App Developer Terms + App submission guidelines interdisent aux apps/connecteurs tiers de chercher à influencer le modèle pour se faire préférer à d'autres apps, ou de dénigrer des concurrents. Un contenu web/API conçu pour "être cité" doit rester factuel, sourcé et vérifiable (fraîcheur des codes) plutôt que manipulatoire dans sa structuration.
- **Perplexity** : intègre déjà publicité et affiliation dans ses propres résultats (signal de tolérance sectorielle) ; pas de politique anti-manipulation spécifique identifiée pour les sources tierces à ce jour. `[À VÉRIFIER / VEILLE]`.
- **Google (AI Overviews/Gemini), Anthropic (Claude)** : pas de CGU spécifique identifiée sur la citation de sources d'affiliation tierces lors de cette recherche — ces politiques évoluent vite ; absence de règle documentée aujourd'hui ne signifie pas absence de risque futur.
- **Point commun à retenir pour la V1 marketplace + commission** : aucune plateforme IA n'autorise le "spam" ou la manipulation du classement des sources ; le modèle défendable est celui d'une source **structurée, vérifiée et transparente** (fraîcheur des codes, divulgation embarquée §3), pas celui d'une source qui tente de forcer sa citation par des techniques d'optimisation agressives (cloaking, keyword stuffing).

**Garde-fou** : checklist de conformité par plateforme IA revue à chaque évolution significative des CGU développeur (trimestrielle a minima), avant toute intégration technique nouvelle (API, plugin, MCP en V1.5).

`[À VÉRIFIER PAR UN JURISTE]` : la nature du risque (contractuel via CGU d'adhésion vs risque business pur de déréférencement sans recours judiciaire) — traiter comme un risque business majeur (perte du canal principal) autant qu'un risque juridique.

---

## 6. RGPD

Deux flux de données distincts à traiter séparément (marketplace = plus complexe que le POC fermé initial) :

**a) Tracking d'attribution IA → conversion** :
- Identifiant traçable (paramètre UTM, lien unique par utilisateur/canal/parrain) = donnée personnelle dès qu'il permet, même indirectement, de réidentifier une personne (IP, device ID, compte).
- **Base légale** : intérêt légitime pour un tracking d'attribution agrégé sans profilage individuel poussé ; **consentement opt-in CNIL** requis dès qu'il y a cookie de traçage tiers ou profilage individualisé du comportement du demandeur.
- Minimisation : ne pas coupler l'identifiant de tracking à l'identité civile du demandeur de code (pas de compte requis côté demandeur pour le POC).
- Conservation : ≤ 13 mois pour les données de mesure d'audience/tracking (recommandation CNIL), sauf obligation légale contraire (facturation, lutte anti-fraude sur les commissions versées).

**b) KYC des parrains (spécifique au modèle marketplace, non couvert par le livrable amont)** :
- Le versement de commissions à des parrains tiers (au-delà de Thomas/Emmanuel) implique la collecte de données d'identité et bancaires (nom, IBAN/RIB, éventuellement pièce d'identité pour lutte anti-fraude/anti-blanchiment selon les volumes).
- **Base légale : exécution du contrat** (le parrain accepte les CGU de la marketplace pour percevoir sa commission) + **obligation légale** pour la conservation des données de facturation (10 ans, obligations comptables/fiscales).
- Obligations classiques : durée de conservation définie et documentée, droit d'accès/rectification/suppression exerçable, DPA (accord de sous-traitance) avec l'hébergeur des données et le prestataire de paiement des commissions (Stripe Connect ou équivalent recommandé pour déléguer la conformité paiement plutôt que la gérer en interne).
- Mentions obligatoires dans les CGU parrains + politique de confidentialité : finalité (versement des commissions, vérification anti-fraude), destinataires, durée, droits, contact DPO/référent RGPD.

**Garde-fou** : registre de traitement minimal distinguant les deux flux (tracking d'attribution / KYC parrains) avant toute ouverture du catalogue à des parrains tiers (passage du POC fermé à la marketplace ouverte).

---

## 7. Checklist conformité avant mise en ligne (POC)

| # | Document/mention | Qui le produit | Statut |
|---|-------------------|-----------------|--------|
| 1 | CGU/CGV de la marketplace (rôle d'intermédiaire, pas vendeur ; commission ; rotation des parrains ; résiliation) | @legal (ce document sert de base, CGU finales à rédiger) | À produire |
| 2 | Politique de confidentialité (tracking d'attribution + KYC parrains si applicable) | @legal | À produire |
| 3 | Mentions légales (éditeur, hébergeur, contact, statut d'intermédiaire non réglementé pour le POC) | @legal | À produire |
| 4 | Bandeau cookies conforme CNIL (consentement positif, refus aussi simple que l'acceptation) | @fullstack (implémentation) + @legal (texte) | À produire |
| 5 | Page "Divulgation affiliation / Comment ça marche" (mention de la commission perçue) | @legal (texte) + @copywriter (ton) | À produire |
| 6 | Fiche de conformité CGU par programme de parrainage intégré (§4) | @legal, avant chaque intégration au catalogue | À produire, processus récurrent |
| 7 | Mention "non affilié officiellement à [Marque]" sur chaque fiche produit | @copywriter (intégration éditoriale) | À produire |
| 8 | Divulgation embarquée dans la donnée retournée (texte/JSON, §3) | @ia / @fullstack (implémentation technique) | À produire |
| 9 | CGU internes "parrains" (acceptation de l'exposition publique de leur lien, §4) | @legal | À produire |
| 10 | Checklist CGU développeur par plateforme IA (§5), revue trimestrielle | @legal, veille continue | À produire puis récurrent |

**Aucun de ces documents n'existe encore** — tous à produire avant mise en ligne publique (le POC actuel = Google Sheet interne, pas de diffusion publique, donc pas encore bloquant, mais à anticiper avant le POC contenu web décrit dans `project-synthesis.md`).

---

## 8. EU AI Act — classification

**Usage IA générative prévu (`project-context.md`)** : distribution via assistants IA tiers (canal externe, hors scope AI Act pour Parrainage-IA lui-même — ce sont OpenAI/Google/Anthropic/Perplexity les fournisseurs de système IA, pas nous) ; potentiellement génération/vérification interne de fiches codes (usage interne).

- **Le canal de distribution (être cité par ChatGPT/Perplexity/Claude/Gemini)** n'entre pas dans le champ de classification AI Act pour Parrainage-IA : nous ne sommes pas fournisseur du système d'IA générative, seulement une source de données qu'il consulte/cite. Pas de classification à faire de ce côté.
- **Si usage interne d'un LLM pour générer ou vérifier automatiquement les fiches produit (fraîcheur des codes, rédaction de description)** : cet usage relève de la classification **risque limité** au sens de l'AI Act (génération de contenu, pas de décision automatisée à fort impact sur une personne physique, pas de biométrie, pas de scoring social, pas de recrutement/crédit/médical).
- **Obligation résultante : transparence uniquement** — mentionner que les fiches/descriptions sont générées ou vérifiées avec l'assistance d'une IA si cela affecte le contenu perçu par l'utilisateur final (ex. "Fiche vérifiée automatiquement" ou équivalent), conformément à l'obligation de transparence de l'AI Act pour le risque limité.
- **Vigilance V1 banque** : si un usage IA venait à orienter automatiquement un utilisateur vers un produit de crédit/financier avec une forme de scoring ou de recommandation personnalisée (pas prévu actuellement), la classification remonterait vers "haut risque" (crédit) — à réévaluer explicitement si ce type de fonctionnalité est envisagé en V1.

**Garde-fou** : documenter dans les mentions légales/CGU tout usage d'IA générative interne affectant le contenu publié (transparence), sans action supplémentaire tant que l'usage reste de la génération/vérification de contenu (risque limité).

---

## Réponse tranchée à la question de fond

**Le POC hors-régulé (énergie, apps, VPN, box, e-commerce) est-il lançable sans statut réglementé ?** **OUI**, motivé par : (a) aucune de ces verticales ne relève d'un monopole bancaire/financier/assurantiel nécessitant IOBSP/ORIAS/agrément ACPR-AMF ; (b) le risque principal identifié (§1 n°1, CGU des programmes de parrainage) est contractuel et se gère programme par programme, pas par un statut réglementé global ; (c) condition stricte : ne pas ajouter de programme bancaire/fintech/assurance/crypto au catalogue tant que le chantier IOBSP/ORIAS de la V1 (§2) n'est pas instruit et tranché — c'est la ligne de démarcation POC/V1 à respecter opérationnellement.

---

## Hypothèses à valider

- `[HYPOTHÈSE]` Le montant exact de la commission marketplace n'est pas encore défini — impacte la lecture "activité habituelle et rémunérée" pertinente pour la qualification IOBSP en V1 (plus la commission est significative et répétée, plus la requalification en intermédiation est probable).
- `[À VALIDER]` Le degré d'accompagnement du demandeur (simple lien exposé vs comparaison/conseil personnalisé "meilleur parrainage pour vous") — détermine la frontière indicateur/IOBSP en V1 (§2).
- `[À VÉRIFIER PAR UN JURISTE]` Tous les points signalés dans le corps du document, en particulier : qualification IOBSP vs simple indicateur (§2), doctrine sur la divulgation restituée par un canal IA tiers (§3), compatibilité CGU parrainage/marketplace au cas par cas (§4).

---

## Gates BLOQUANT vérifiées

- **G1** : 8 sections numérotées présentes, 0 section < 2 lignes, 0 `[TODO]` résiduel. PASS.
- **G3** : bloc Handoff structuré présent en fin de document. PASS.
- **G5** : persona non directement adressé ici (livrable de conformité B2B interne, pas client-facing) — cohérent avec le rôle de @legal sur ce type de livrable ; N/A documenté.
- **G7** : 0 contradiction — vérifié par Read de `conformite-parrainage-ia.md` (risques P0/P1/P2 repris et enrichis, pas contredits) et `project-synthesis.md` (verdict GO POC conditionnel repris, verticales hors-régulé/régulé alignées avec le cadrage confirmé par Thomas). PASS.
- **G12** : chaque garde-fou et chaque ligne de la checklist §7 porte un verbe d'action + un objet + un responsable + un critère de done (produit/pas produit). PASS.
- **G13** : chiffres cités sourcés (délit IOBSP 2 ans/300 000 €, seuils DGCCRF 75 000 €, seuil ARPP 75% aux 25 QCM) — tous issus des WebSearch documentées en tête de document ou du livrable amont ; 0 chiffre inventé. PASS.
- **G15** : Grep du document sur les patterns placeholder (`[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER`) — 0 occurrence. Seules occurrences volontaires : `[À VÉRIFIER PAR UN JURISTE]`, `[HYPOTHÈSE]`, `[À VALIDER]` (annotations autorisées). PASS.
- **G17** : le document est calibré sur le modèle exact du projet (marketplace à rotation + commission + verticales POC/V1 spécifiques confirmées par Thomas) et sur des sources datées 2026 (ORIAS, ARPP) — un concurrent générique ne peut pas le réutiliser tel quel sans adapter à son propre découpage de verticales. PASS.
- **G_PROOF** : bloc `Vérifié :` ci-dessous. PASS.

**Vérifié :** Projection sur un cas réel — une fiche "parrainage EDF" (verticale énergie, hors-régulé) citée par ChatGPT dans sa réponse à "code parrainage EDF".
`Read docs/legal/legal-strategy.md §2 + §3` : la fiche EDF ne nécessite aucun statut réglementé (énergie hors monopole bancaire/financier confirmé §2) ; la divulgation est satisfaite SI ET SEULEMENT SI le texte brut de la fiche source (JSON/page) contient la mention embarquée type "Lien de parrainage EDF : Parrainage-IA perçoit une commission si vous l'utilisez" ET que le programme EDF autorise contractuellement la diffusion tierce (fiche de conformité §4/§7 point 6, non encore produite pour EDF spécifiquement — action à mener AVANT intégration réelle). Conclusion : le cadre théorique tient, mais la divulgation n'est "satisfaite" en pratique que si (a) la mention est effectivement codée dans la donnée ET (b) l'IA la restitue sans troncature (non garanti, §3 zone grise documentée) — le POC doit tester ce point empiriquement (rejoint le test de distribution Temps 0 de `project-synthesis.md`).

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/legal/legal-strategy.md`
- Décisions prises : POC hors-régulé (énergie/apps/VPN/box/e-commerce) lançable SANS statut réglementé (motivé §2) ; V1 banque/fintech nécessite immatriculation ORIAS (IOBSP) + veille ACPR/AMF/ARPP AVANT tout ajout de programme bancaire au catalogue ; checklist conformité pré-lancement à 10 items produite (§7) ; classification AI Act = risque limité/transparence pour l'usage interne éventuel de génération de fiches.
- Points d'attention pour @product-manager : la ligne de démarcation POC/V1 (§2) doit être une contrainte produit explicite (garde-fou dans les specs : pas d'ajout de programme bancaire tant que le statut ORIAS n'est pas obtenu) ; la checklist §7 (10 documents) est un prérequis avant toute mise en ligne publique, à intégrer dans la roadmap.
- Points d'attention pour @copywriter : mentions obligatoires à rédiger — divulgation affiliation (§3), "non affilié officiellement à [Marque]" (§7 point 7), CGU/politique de confidentialité en langage clair (résumé "risques en 5 points" déjà fourni en tête de ce document, à vulgariser pour Thomas/Emmanuel non-juristes).
- Points d'attention pour @data-analyst : le tracking d'attribution (§6a) doit respecter la base légale intérêt légitime/consentement et la conservation ≤ 13 mois avant de définir le plan de tracking.
- Points d'attention pour @fullstack/@infrastructure : implémentation technique requise pour la divulgation embarquée dans la donnée (§3, §7 point 8), le bandeau cookies CNIL (§7 point 4), et le KYC parrains délégué à un prestataire de paiement (Stripe Connect ou équivalent recommandé, §6b) plutôt que géré en interne.
- Recommandation forte : faire valider ce document par un avocat spécialisé droit bancaire/financier (statut IOBSP) et droit de la consommation/influence AVANT toute ouverture de la V1 banque — les points `[À VÉRIFIER PAR UN JURISTE]` sur la qualification indicateur/IOBSP sont structurants pour le go/no-go V1.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable d'analyse, aucun code produit). Actions futures signalées ci-dessus pour @fullstack/@infrastructure au moment de l'implémentation.
---
</content>
