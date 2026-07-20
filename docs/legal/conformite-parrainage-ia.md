<!-- Version: 2026-07-20T00:00 — @legal — Analyse de conformité initiale (stade idée / POC) -->

# Conformité & risque juridique — Parrainage-IA

**Stade : Idée / POC.** Ce document est un **draft de référence**, pas un avis juridique formel. Toute mise en production réelle (au-delà du POC Google Sheet) doit être validée par un avocat, notamment sur les points marqués `[À VÉRIFIER PAR UN JURISTE]`.

## Résumé exécutif — risques en 5 points

1. **Le modèle de base n'est PAS illégal en soi** : agréger et republier des liens/codes de parrainage publics, en étant transparent, est une activité d'affiliation licite (comme Dealabs, iGraal, Rakuten). Le risque n'est pas la légalité de l'activité mais **la conformité d'exécution** (CGU des programmes, divulgation, RGPD).
2. **Risque P0 n°1 — violation des CGU des programmes de parrainage** : la quasi-totalité des programmes bancaires/VPN/apps interdisent la diffusion publique/incitée des liens de parrainage (réservée à un usage privé) → résiliation du compte parrain + perte des gains acquis, sur simple constat, sans recours. C'est un risque business autant que juridique.
3. **Risque P0 n°2 — absence de mention de la relation d'affiliation dans la réponse IA** : la loi Influenceurs (2023) + le droit de la consommation exigent une divulgation claire et immédiate ; or une réponse d'assistant IA (ChatGPT, Perplexity) ne montre typiquement aucune bannière — le canal de diffusion échappe à notre contrôle éditorial direct.
4. **Risque P1 — CGU des plateformes IA** : OpenAI encadre déjà les apps/MCP tiers (App Developer Terms, App submission guidelines) et interdit de biaiser la sélection de l'outil par le modèle ; un MCP conçu pour "être la réponse citée" doit rester dans les clous de neutralité, sous peine de déréférencement de l'app/connecteur.
5. **Risque P2 — marques et RGPD** : usage des noms de marques (BoursoBank, NordVPN, etc.) dans les fiches = référence nominative tolérée si descriptive et non trompeuse ; le tracking d'attribution des conversions déclenche RGPD (cookies/identifiants = données personnelles).

**Verdict global : GO pour le POC (catalogue interne, pas de diffusion publique large), avec garde-fous à poser AVANT toute mise en distribution publique via IA.** Aucun blocage — signalement de risques conformément au protocole.

---

## (1) Légalité de la diffusion/agrégation de codes de parrainage tiers

**Principe** : agréger des codes/liens de parrainage et les rendre disponibles au public est une pratique d'affiliation existante et licite en France (comparateurs, sites de codes promo, extensions navigateur). Rien n'interdit par la loi de republier un lien de parrainage qu'on détient légitimement.

**Le vrai risque est contractuel, pas légal au sens strict** : chaque programme de parrainage (banque, VPN, app) a ses propres CGU, et celles-ci contiennent quasi-systématiquement des clauses restrictives :
- **Interdiction de diffusion publique/incitée** : la quasi-totalité des CGU de parrainage bancaire (ex. La Banque Postale, BoursoBank) et VPN précisent que le lien doit être partagé "à titre personnel" (email, SMS, réseau restreint) et que toute diffusion sur un site public, forum de coupons, publicité payante ou plateforme tierce est interdite.
- **Sanction contractuelle** : résiliation du statut de parrain, annulation/récupération des primes déjà versées, voire clôture du compte associé, à la discrétion de l'émetteur — sans recours judiciaire réaliste vu les montants en jeu.
- **Cas particulier crypto/actifs numériques** : l'article L.222-16-2 du Code de la consommation interdit certaines opérations de parrainage/mécénat faisant une publicité directe ou indirecte pour des services sur actifs numériques non agréés — pertinent si le catalogue inclut des codes crypto/PSAN. Voir la sanction DGCCRF récente contre Binance sur ce terrain.

**Conséquence pour le modèle "annuaire deux faces"** : si Parrainage-IA devient une place de marché ouverte à des tiers parrains (pas seulement Thomas & Emmanuel), le catalogue republiera des liens dont les CGU sous-jacentes interdisent souvent explicitement ce type de republication tierce à but commercial. **Chaque programme intégré doit être vérifié individuellement.**

**Garde-fou** : constituer, par programme, une fiche "CGU parrainage" (autorisé/interdit/zone grise) avant intégration au catalogue — a minima pour les 5-10 premiers programmes du POC.

`[À VÉRIFIER PAR UN JURISTE]` : la qualification exacte (rupture de contrat vs. concurrence déloyale vs. rien) varie par programme ; pas de règle générale unique en droit français sur la republication de liens d'affiliation tiers.

---

## (2) Obligations de transparence — divulgation de la relation d'affiliation

**Cadre applicable** :
- **Loi n° 2023-451 du 9 juin 2023** (encadrement de l'influence commerciale), modifiée par l'ordonnance n° 2024-978 du 6 novembre 2024 pour compatibilité UE.
- **Directive Omnibus (UE) 2019/2161**, transposée en droit français (Code de la consommation), qui renforce les obligations de transparence sur les pratiques commerciales et interdit les pratiques commerciales trompeuses par omission.
- **DGCCRF** : contrôle actif — 60% d'anomalies relevées chez les influenceurs contrôlés en 2023-2024 ; sanctions jusqu'à 75 000 € ou transmission au procureur pour pratique commerciale trompeuse.

**Obligations concrètes** :
- Toute recommandation à caractère commercial (y compris affiliation/parrainage) doit porter une mention claire, lisible, immédiatement identifiable ("Publicité", "Collaboration commerciale", ou équivalent adapté depuis l'assouplissement de nov. 2024 : "produit offert", "partenariat").
- Le lien financier (commission d'affiliation) fait basculer l'activité dans l'"influence commerciale" au sens de la loi — le lecteur doit comprendre immédiatement qu'il s'agit d'une opération rémunérée.
- Depuis le décret du 28 nov. 2025, un contrat écrit est obligatoire entre annonceur/agent et "influenceur" au-delà de 1 000 € HT de rémunération.

**Le problème spécifique à Parrainage-IA** : quand un assistant IA (ChatGPT, Perplexity, Gemini) cite notre source et affiche le code/lien directement dans sa réponse, **nous ne contrôlons pas l'affichage final** — pas de bannière possible dans la réponse de l'IA elle-même.

**Garde-fou actionnable** : la divulgation doit être portée **par la donnée elle-même**, pas par l'interface de l'IA qu'on ne contrôle pas :
- Chaque code/lien exposé via MCP/API doit embarquer, dans le contenu textuel retourné au modèle, une mention explicite type *"Lien de parrainage [Marque] — divulgation : Parrainage-IA perçoit un avantage si vous l'utilisez."* — pour maximiser la chance que le modèle la restitue.
- Mentionner la relation d'affiliation sur toute page web/fiche publique consultable (source primaire), condition nécessaire même si insuffisante pour couvrir la restitution IA.
- `[À VÉRIFIER PAR UN JURISTE]` : la jurisprudence/doctrine sur la divulgation quand le "canal" est un tiers (l'IA) qui peut tronquer la mention est inexistante à ce jour (2026) — zone grise réglementaire de premier ordre pour ce secteur naissant (GEO/AEO).

---

## (3) CGU des plateformes IA — restrictions applicables

- **OpenAI** : les App Developer Terms et App submission guidelines encadrent les apps/connecteurs/actions tiers, y compris via MCP. Règle notable : les descriptions d'outils **ne doivent pas chercher à influencer le modèle pour se faire préférer** à d'autres apps, ni dénigrer des concurrents. Un MCP conçu explicitement pour "devenir la réponse citée par l'IA" doit rester factuel et neutre dans ses descriptions techniques (nom d'outil, description) sous peine de retrait du app/connector store.
- Le output généré par le modèle référençant un tiers n'implique aucune approbation/affiliation d'OpenAI avec ce tiers — à rappeler dans nos propres CGU/mentions.
- **Perplexity** : intègre déjà publicité et liens d'affiliation dans ses propres résultats — signal que le secteur est toléré, mais pas d'information trouvée sur des règles spécifiques anti-manipulation pour sources tierces. `[À VÉRIFIER PAR UN JURISTE / VEILLE]`.
- **Google (Gemini/AI Overviews), Anthropic (Claude)** : pas de CGU spécifique identifiée sur l'opération de serveurs MCP tiers à but d'affiliation lors de cette recherche — **à vérifier explicitement avant intégration**, ces politiques évoluent vite (2026) et un manquement peut entraîner un déréférencement pur et simple du connecteur, ce qui tue le modèle économique du jour au lendemain.

**Garde-fou** : avant toute intégration technique à un écosystème IA (MCP OpenAI, plugin, etc.), relire les conditions développeur à jour de la plateforme concernée — le POC doit inclure une checklist de conformité par plateforme, mise à jour à chaque changement de CGU (risque mouvant, pas figé).

`[À VÉRIFIER PAR UN JURISTE]` : qualification du risque contractuel vs. risque business pur (perte d'accès à la plateforme sans recours) — probablement traité en CGU (contrat d'adhésion), pas en droit commun.

---

## (4) RGPD — attribution des conversions = tracking

- Attribuer une conversion de parrainage à une réponse IA nécessite un identifiant traçable (paramètre UTM, cookie, identifiant de session, ou lien unique par utilisateur/canal) → **donnée personnelle si elle permet, même indirectement, de réidentifier une personne** (adresse IP, device ID, compte utilisateur).
- Base légale : intérêt légitime possible pour un tracking d'attribution agrégé/anonymisé sans profilage individuel ; **consentement (opt-in CNIL)** requis si cookies de traçage tiers ou profilage individualisé.
- Si un compte "parrain" est créé (données d'identité, IBAN/RIB pour verser des gains) : traitement au titre de l'exécution du contrat, avec obligations classiques (durée de conservation définie, droit d'accès/suppression, DPA avec l'hébergeur des données).
- Conservation des logs d'attribution : ≤ 13 mois recommandé par la CNIL pour les données de mesure d'audience/tracking, sauf obligation légale contraire (facturation, lutte anti-fraude).

**Garde-fou** : dès le POC, ne pas mélanger identifiant de tracking et donnée d'identité en clair ; documenter le flux "clic IA → conversion → attribution" dans un registre de traitement minimal avant la V1.

---

## (5) Risques marque/contrefaçon — usage des noms de marques tiers

- **Principe** : citer une marque tierce (NordVPN, BoursoBank, etc.) à titre **descriptif et informatif**, pour désigner le produit dont on relaie une offre, est en principe licite (usage nominatif, pas de risque de contrefaçon au sens de l'article L.713-1 CPI si pas de confusion créée sur l'origine).
- **Risque réel** : (a) suggérer une **affiliation officielle ou un partenariat** avec la marque alors qu'il n'existe qu'un programme de parrainage grand public ouvert → risque de confusion / pratique commerciale trompeuse ; (b) utiliser le logo officiel sans licence (droit des marques, au-delà du simple nom en texte) ; (c) déposer un nom de domaine ou une marque incluant le nom d'un tiers (ex. "coupon-nordvpn.fr") — risque de contrefaçon/parasitisme nettement plus élevé.
- **Garde-fou** : mention explicite type "non affilié officiellement à [Marque]" sur chaque fiche produit ; ne jamais utiliser de logo sans autorisation ; vérifier disponibilité de la marque propre du projet à l'INPI/EUIPO (cf. mission @legal standard) pour ne pas elle-même entrer en conflit.

`[À VÉRIFIER PAR UN JURISTE]` : seuil précis entre usage nominatif toléré et parasitisme économique — dépend du volume et de la présentation (ex. page dédiée par marque avec logo vs. simple mention dans un tableau).

---

## Risques classés

| # | Risque | Criticité | Impact | Garde-fou |
|---|--------|-----------|--------|-----------|
| 1 | Diffusion publique de liens de parrainage en violation des CGU des programmes | **P0** | Résiliation compte parrain + perte gains, sans recours | Fiche CGU par programme avant intégration ; réserver aux programmes qui autorisent la diffusion tierce |
| 2 | Absence de divulgation de la relation d'affiliation restituée par l'IA | **P0** | Sanction DGCCRF (jusqu'à 75 000 €), pratique commerciale trompeuse | Embarquer la mention de divulgation dans la donnée retournée par le MCP, pas seulement sur le site |
| 3 | Non-conformité aux CGU développeur des plateformes IA (OpenAI, etc.) | **P1** | Déréférencement du connecteur = mort du canal de distribution | Checklist de conformité par plateforme, veille CGU continue |
| 4 | Tracking d'attribution non conforme RGPD | **P1** | Sanction CNIL, mise en demeure | Registre de traitement minimal, séparation identifiant/données d'identité, conservation ≤ 13 mois |
| 5 | Confusion de marque / parasitisme sur les fiches produit | **P2** | Mise en demeure, retrait de contenu | Mention "non affilié officiellement", pas de logo sans licence |
| 6 | Programmes crypto/actifs numériques (art. L.222-16-2 conso) | **P2** (si catalogue inclut crypto) | Sanction DGCCRF type Binance | Exclure les codes crypto/PSAN du catalogue au démarrage, ou traiter à part avec avis juriste dédié |

---

## Réponse à la question de fond : le modèle est-il légal ?

**Oui, dans son principe.** L'affiliation et le parrainage relayés par un tiers existent déjà (Dealabs, iGraal, extensions navigateur, comparateurs) et ne sont pas interdits par la loi française ou européenne. **Ce qui doit être vérifié projet par projet, programme par programme, c'est l'exécution** : (a) les CGU de chaque programme de parrainage intégré autorisent-elles la republication tierce, (b) la divulgation de la relation commerciale est-elle effective jusque dans la réponse de l'IA, (c) l'intégration technique respecte-t-elle les CGU développeur des plateformes IA. Le POC actuel (catalogue interne Thomas + Emmanuel, sans diffusion publique large) est un terrain sûr pour apprendre et itérer ; le risque monte fortement au moment où (i) le catalogue s'ouvre à des parrains tiers (place de marché), et (ii) la diffusion via IA devient large échelle.

---

## Garde-fous actionnables (à mettre en place avant la V1)

1. **Fiche de conformité par programme de parrainage intégré** (CGU lues, diffusion tierce autorisée oui/non, sanction encourue) avant tout ajout au catalogue.
2. **Mention de divulgation embarquée dans la donnée** exposée par le MCP/API (pas seulement sur un site web que l'utilisateur ne visitera peut-être jamais).
3. **Checklist CGU développeur par plateforme IA** (OpenAI App Developer Terms, et équivalents Google/Anthropic/Perplexity à identifier), revue à chaque changement de politique.
4. **Registre de traitement minimal RGPD** pour le tracking d'attribution, avec séparation identifiant technique / donnée d'identité.
5. **Charte marque** : mention systématique "non affilié officiellement à [Marque]" + interdiction d'usage de logos sans autorisation sur toute fiche produit.

---

## Hypothèses à valider

- `[HYPOTHÈSE]` Le modèle de revenu exact (part des gains vs. abonnement) n'est pas tranché — impacte la qualification du risque n°1 (si Parrainage-IA touche une commission sur commission, cela renforce le lien commercial à divulguer).
- `[À VALIDER]` Périmètre exact : catalogue fermé (Thomas + Emmanuel) ou place de marché ouverte à des parrains tiers — le risque n°1 est mineur dans le premier cas, majeur dans le second.
- `[À VÉRIFIER PAR UN JURISTE]` Tous les points marqués ci-dessus dans le corps du document, en particulier la divulgation dans un canal IA non contrôlé (zone réglementaire non stabilisée en 2026) et la qualification exacte de la republication de CGU de parrainage tierces.

---

**Sources consultées (WebSearch)** :
- [Marketing d'affiliation : transparence & sanctions DGCCRF — Deshoulières Avocats](https://www.deshoulieres-avocats.com/marketing-daffiliation-transparence-sanctions-dgccrf/)
- [LOI n° 2023-451 du 9 juin 2023 — Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047663185)
- [Quels sont mes devoirs ? — economie.gouv.fr](https://www.economie.gouv.fr/influenceurs-quels-sont-mes-devoirs)
- [Loi Influenceurs : obligations, sanctions et cadre légal — Kibler Avocat](https://kibleravocat.com/actualites/loi-influenceurs)
- [Loi sur l'influence commerciale : mise en conformité avec le droit européen — TGS France Avocats](https://www.tgs-avocats.fr/blog/modification-loi-influence-commerciale)
- [Parrainage crypto et PSAN : sanction DGCCRF contre Binance — Kohen Avocats](https://kohenavocats.fr/2026/04/28/parrainage-crypto-psan-dgccrf-binance-influenceurs-risques/)
- [Quelles sont les règles à suivre en matière de parrainage — CNIL](https://www.cnil.fr/fr/cnil-direct/question/quelles-sont-les-regles-suivre-en-matiere-de-parrainage)
- [App submission guidelines – Apps SDK — OpenAI Developers](https://developers.openai.com/apps-sdk/app-submission-guidelines)
- [App Developer Terms — OpenAI](https://openai.com/policies/developer-apps-terms/)
- [Usage policies — OpenAI](https://openai.com/policies/usage-policies/)

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/legal/conformite-parrainage-ia.md`
- Décisions prises : aucune décision bloquante — 2 risques P0 identifiés (violation CGU parrainage tiers, divulgation non restituée par l'IA), 2 P1 (CGU plateformes IA, RGPD tracking), 2 P2 (marque, crypto). Verdict : GO POC actuel, garde-fous à poser avant V1/ouverture publique.
- Points d'attention : (1) le modèle de revenu et le périmètre (catalogue fermé vs. marketplace ouverte) ne sont pas tranchés — impacte directement la criticité du risque n°1, à clarifier avec Thomas/Emmanuel ; (2) recommander une revue par un avocat spécialisé droit de la consommation/influence avant toute mise en distribution publique large ; (3) la divulgation dans un canal IA non contrôlé est une zone réglementaire non stabilisée — sujet à surveiller (veille) plutôt qu'à considérer comme résolu.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise (stade analyse, aucun code produit).
---
