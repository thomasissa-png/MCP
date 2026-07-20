<!-- Version: 2026-07-20T02:00 — @product-manager — REFRESH Phase 0 (corrections fondateur cercle fermé T&E) -->

<!-- DIFF vs version 2026-07-20T00:00 :
1. V1 n'est plus une marketplace ouverte : cercle FERMÉ Thomas + Emmanuel (2 parrains, 9 offres réelles). L'épic "Onboarding/soumission parrain" est retiré du V1 et devient un chantier V2 (section 4, nouvelle).
2. La "rotation" V1 devient un arbitrage entre les liens de T&E (2 identités, 9 programmes), pas une rotation dans un pool ouvert.
3. Les verticales sont recalées sur la base réelle d'Emmanuel : finance personnelle/néobanque, investissement, gestion de patrimoine, placement trésorerie, services entrepreneur, crypto — BANQUES INCLUSES dès le V1 (Trade Republic, Qonto, Revolut Business). Télécom/Énergie/Mobilité passent en "à venir" (retirés de l'exclusion "hors V1 régulé" précédente, qui n'a plus lieu d'être : ce n'était pas la bonne exclusion).
4. L'épic "Catalogue d'offres" est explicitement rattaché au schéma de données d'Emmanuel (20 champs, cf. product-vision.md §4) et non à un schéma générique.
5. Marque = Parrainly (tranché, project-context.md CHOIX #2). MCP abandonné : les endpoints envisagés deviennent une API JSON classique (épic 6, inchangé sur le fond, terminologie clarifiée).
6. Point de vigilance non résolu par ce document : legal-strategy.md n'a pas encore été réévalué par @legal en configuration "cercle fermé, liens personnels de T&E" (risque différent d'une marketplace à commission tierce) — signalé en fin de document, pas tranché ici (hors mandat @product-manager).
-->

# Roadmap — Parrainly (V1 cercle fermé Thomas & Emmanuel)

## Résumé exécutif

- **V1 = cercle fermé.** Catalogue des 9 offres réelles détenues par Thomas & Emmanuel (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko), pages structurées selon le schéma Emmanuel (20 champs), moteur d'arbitrage entre les liens de T&E (pas une rotation ouverte), vérification de fraîcheur automatisée, API JSON publique, tracking d'attribution IA→conversion, back-office minimal, pages de conformité et fiches de conformité par programme.
- **V2 = ouverture marketplace.** Onboarding/soumission de parrains externes, KYC parrains, commission tierce, statut d'intermédiaire élargi (cf. section 4, nouvelle). Le V1 est bâti pour permettre ce passage (objets métier déjà pensés pour un pool élargi), mais aucune brique d'ouverture n'est développée en V1.
- Priorisation MoSCoW + RICE (RICE = estimation qualitative du PM sur échelle 1-5 par facteur, Effort non pondérant car quasi nul en exécution IA — cf. CLAUDE.md commandement 5).
- Séquencement par dépendances, pas par sprints : les pages de conformité et les objets métier (Programme/Offre au schéma Emmanuel, Parrain=T&E, Attribution/Conversion) sont le socle bloquant de tout le reste.
- Hors V1 explicite : ouverture marketplace (section 4), MCP (canal B2C non pertinent, cf. faisabilite-geo-parrainage-ia.md ; les tools envisagés deviennent des endpoints d'API JSON), paiement automatisé des commissions (KYC/versement délégué à un prestataire, V1.5 sans objet tant que V1 = 2 parrains identifiés), extension navigateur/GPT Store.

---

## 1. Épics V1 — priorisation MoSCoW + RICE

RICE : Reach/Impact/Confiance sur échelle 1-5 (estimation qualitative PM, pas une donnée mesurée), Effort non pondérant (mindset IA, cf. CLAUDE.md commandement 5) → Score = R×I×C.

| # | Épic | MoSCoW | Reach | Impact | Confiance | Score RICE | Justification |
|---|---|---|---|---|---|---|---|
| 1 | Pages de conformité (CGU, confidentialité, mentions légales, divulgation, incluant les mentions financières spécifiques aux programmes régulés) | Must | 5 | 5 | 5 | 125 | Bloquant légal avant toute mise en ligne publique (legal-strategy.md §7) ; sans ce socle, aucune autre page ne peut être publiée. Périmètre élargi : les mentions financières (Trade Republic, Ramify, Finary, Spiko, Kraken, Meria) s'ajoutent aux mentions génériques puisque les banques/fintech sont désormais IN V1. |
| 2 | Catalogue des 9 offres réelles (Programme/Offre au schéma Emmanuel 20 champs, pages structurées schema.org) | Must | 5 | 5 | 5 | 125 | Actif central du canal GEO (faisabilite-geo-parrainage-ia.md) ; le catalogue est connu et fini (9 offres réelles, `data/base-parrainage-emmanuel-v3.xlsx`), la confiance monte à 5 par rapport à la version précédente (catalogue hypothétique ouvert). |
| 3 | Moteur d'arbitrage entre les liens de T&E | Must | 3 | 5 | 4 | 60 | Cœur du modèle (product-vision.md §2), mais périmètre réduit : arbitrer entre 2 identités (Thomas, Emmanuel) sur 9 programmes, pas une rotation dans un pool ouvert. Reach à 3 (2 parrains, pas un pool) ; confiance remonte à 4 (le nombre de liens et de plafonds à gérer est désormais connu et fini, contre un pool hypothétique en V1 précédent). |
| 4 | Vérification de fraîcheur automatisée | Must | 4 | 5 | 3 | 60 | KPI de survie du modèle (brand-platform.md §3 preuve Fraîcheur, growth §3.3) ; confiance à 3 tant que la fréquence de re-vérification n'est pas chiffrée (reste `[À VALIDER]`, configurable, jamais codée en dur). |
| 5 | Tracking d'attribution IA→conversion | Must | 4 | 5 | 3 | 60 | Sans traçabilité, ni commission calculable ni KPI North Star mesurable (project-context.md, kpi-framework.md). |
| 6 | API JSON publique (endpoints ex-tools MCP : recherche d'offres, fiche par id, liste des catégories) | Should | 3 | 4 | 4 | 48 | Actif pivot identifié par @ia (architecture-mcp-parrainage-ia.md), reformulé sans MCP (project-context.md CHOIX #2 point 4) : `search_referrals` → `GET /api/v1/offres`, `get_referral_by_id` → `GET /api/v1/offres/{id}`, `list_categories` → `GET /api/v1/categories`. Canal secondaire au lancement, priorité juste sous le catalogue web. |
| 7 | Back-office minimal (T&E) | Should | 2 | 3 | 5 | 30 | Périmètre réduit par rapport à la version précédente : pas de file de validation de soumissions tierces (V2), seulement gestion des 9 offres (statut, quota, date de vérification par T&E) et suivi des fiches de conformité par programme. Reach à 2 (2 opérateurs, T&E eux-mêmes). |

**Chalengé et retenu tel quel** : chaque épic est rattaché soit à une obligation légale bloquante (pages de conformité), soit à un objet métier structurant du modèle cercle fermé (product-vision.md §4), soit au canal de distribution validé (@geo). **Retiré du V1 et déplacé en section 4 (V2)** : l'épic "Onboarding/soumission parrain" (précédemment Must, RICE 64) — en cercle fermé T&E, il n'y a rien à onboarder en V1 ; cet épic redevient pertinent seulement à l'ouverture marketplace. Un épic "extension navigateur / GPT Store" reste explicitement écarté du V1 : @geo le classe canal secondaire opportuniste sans traction actuelle (faisabilite-geo-parrainage-ia.md §2).

---

## 2. Séquencement par dépendances

Pas de découpage en semaines/sprints (CLAUDE.md commandement 5). L'ordre ci-dessous reflète des dépendances techniques et légales strictes, pas un calendrier.

**Palier 0 — Socle bloquant (aucune autre publication possible avant)**
- Épic 1 (Pages de conformité) : dépend de rien, doit précéder toute mise en ligne publique (legal-strategy.md §7 : "aucun de ces documents n'existe encore, tous à produire avant mise en ligne publique"). Inclut désormais la fiche de conformité par programme pour les 6 programmes à enjeu réglementaire (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Spiko, Kraken, Meria).
- Modélisation des 3 objets métier (Programme/Offre au schéma Emmanuel, Parrain=T&E, Attribution/Conversion, product-vision.md §4) : dépend de rien, socle technique de tous les épics suivants.

**Palier 1 — Alimentation du registre (dépend du Palier 0)**
- Épic 2 (Catalogue des 9 offres réelles) : dépend de la modélisation Programme/Offre + pages de conformité (mention "non affilié officiellement", divulgation embarquée). Alimentation initiale = import direct des 9 lignes de `data/base-parrainage-emmanuel-v3.xlsx`, pas de formulaire de soumission (cercle fermé).

**Palier 2 — Mécanique cœur (dépend du Palier 1)**
- Épic 3 (Moteur d'arbitrage T&E) : dépend d'avoir le catalogue des 9 offres (épic 2) et les 2 identités Parrain (T&E) créées en base pour avoir une matière à arbitrer.
- Épic 4 (Vérification de fraîcheur automatisée) : dépend du catalogue d'offres existant (épic 2) ; peut être développée en parallèle de l'épic 3.

**Palier 3 — Exposition et mesure (dépend du Palier 2)**
- Épic 6 (API JSON publique) : dépend du moteur d'arbitrage (épic 3) pour exposer des liens réellement attribués, pas des liens statiques.
- Épic 5 (Tracking d'attribution IA→conversion) : dépend de l'épic 3 (objet Attribution/Conversion existant) pour avoir un événement à tracker.

**Palier 4 — Opération (peut démarrer dès le Palier 1)**
- Épic 7 (Back-office minimal) : dépend des objets métier (Palier 0) ; sert à T&E pour gérer statut/quota/fraîcheur des 9 offres et suivre les fiches de conformité par programme. Périmètre volontairement réduit (pas de file de validation de soumissions tierces, cf. section 4 V2).

**Palier V1→V2 (déclencheur du passage, cf. section 4)**
- Le passage à l'ouverture marketplace (épic "Onboarding/soumission parrain", section 4) ne démarre qu'une fois le Palier 4 stable en production ET la réévaluation légale en configuration marketplace/commission tierce effectuée par @legal (le profil de risque change : legal-strategy.md actuel a été rédigé pour une marketplace ouverte, PAS pour le cercle fermé T&E — à réconcilier avant toute décision d'ouverture, cf. section 5).

---

## 3. Hors V1 (explicitement exclu, avec raison business)

| Exclu | Raison business | Condition de réintégration |
|---|---|---|
| Ouverture de la marketplace à des parrains externes (onboarding, KYC, commission tierce) | Cercle fermé T&E tranché par le fondateur (project-context.md CHOIX #2 point 3) ; l'onboarding tiers n'a pas d'utilité tant que le pool = 2 personnes connues | Voir section 4 (V2) : condition de passage documentée |
| Serveur MCP grand public comme canal d'acquisition | Adoption grand public quasi nulle en 2026, aucune traction B2C observée (faisabilite-geo-parrainage-ia.md §2) | Réévaluer si une plateforme IA majeure lance un catalogue de connectors grand public en 1 clic (signal à surveiller, pas hypothèse de travail) |
| Paiement automatisé des commissions parrains (versement direct intégré) | KYC bancaire (IBAN, identité) + conformité anti-blanchiment nécessitent un prestataire de paiement dédié ; avec 2 parrains connus (T&E), un versement manuel suivi en back-office suffit en V1 | Intégrer un prestataire de paiement en V2 une fois le volume de parrains tiers dépassant Thomas/Emmanuel justifie l'automatisation |
| Extension navigateur / App ChatGPT / Gemini Extension | Canal secondaire opportuniste sans priorité de lancement (faisabilite-geo-parrainage-ia.md §2, canal (c)) | Une fois le catalogue et l'API JSON stabilisés, activer une fois le canal validé, en réutilisant la même donnée |
| Comparaison/conseil personnalisé "meilleure offre pour vous" | Rapproche le produit de la frontière indicateur/IOBSP dès qu'un accompagnement dépasse le simple lien exposé, en particulier sur les programmes régulés (Trade Republic, Ramify, Finary, Spiko) | À ne réintroduire qu'après validation juridique explicite du statut par @legal |
| Télécom, Énergie, Mobilité (nouvelles verticales) | Catégories "à venir" selon la base réelle d'Emmanuel (project-context.md), pas de programme réel disponible à date dans ces catégories | Ajouter dès qu'Emmanuel documente des programmes réels dans ces catégories, suivant le même processus de fiche de conformité |

---

## 4. V2 — Ouverture marketplace (hors V1, documentée pour cadrer la trajectoire)

**Déclencheur** : le Palier 4 du V1 est stable en production ET @legal a réévalué legal-strategy.md en configuration marketplace/commission tierce (le document actuel, non encore mis à jour suite à ce corrective, a été écrit pour un pool ouvert — la réévaluation en cercle fermé reste à faire dans l'autre sens : documenter le risque qui REVIENT quand on rouvre).

| Chantier V2 | Description | Dépend de |
|---|---|---|
| Onboarding/soumission parrain externe | Formulaire de soumission de lien + file de validation back-office (repris du travail déjà cadré dans la version précédente de ce document, conservé comme brouillon de référence dans functional-specs.md, section "Reporté en V2") | Palier 4 V1 stable |
| KYC parrains | Collecte identité + IBAN pour verser une commission à un parrain tiers (pas nécessaire tant que les bénéficiaires sont T&E, déjà identifiés) | Onboarding parrain externe |
| Commission tierce / statut d'intermédiaire élargi | Réévaluation légale : au-delà de T&E, le volume et la diversité des parrains peuvent faire basculer la qualification (indicateur vs IOBSP, cf. legal-strategy.md §2) | Instruction @legal dédiée à la configuration ouverte |
| Élargissement du pool de rotation | Le moteur d'arbitrage T&E (épic 3 V1) est étendu en moteur de rotation multi-parrains (déjà pensé comme extensible dans product-vision.md §2, pas une réécriture complète) | Onboarding + KYC |

**Condition de passage V1→V2 (à valider par Thomas avant tout développement V2)** : le catalogue des 9 offres génère des conversions confirmées mesurables (KPI North Star) ET au moins un signal de demande de parrains tiers souhaitant rejoindre le registre a été observé — pas une date calendaire.

---

## Gates BLOQUANT vérifiées

- **G1** : 4 sections numérotées + résumé exécutif, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff présent en fin de document. PASS.
- **G5** : N/A documenté — livrable de priorisation/planification, pas de copy client-facing adressant directement un persona ; les épics restent reliés au périmètre fintech/entrepreneur de project-context.md.
- **G7** : contradictions résiduelles connues et signalées (pas cachées) — brand-platform.md et legal-strategy.md n'ont pas encore été refresh suite à CHOIX #2 (ils décrivent encore une marketplace ouverte hors-régulé) ; ce document, lui, applique déjà l'autorité de project-context.md CHOIX #2. Cohérent avec faisabilite-geo-parrainage-ia.md (API JSON + catalogue comme canal principal, MCP abandonné) et kpi-framework.md (non touché par ce corrective). PASS pour ce document seul ; contradiction inter-documents signalée en "Points à valider" du retour de session (hors mandat @product-manager de corriger brand-platform.md/legal-strategy.md).
- **G12** : chaque épic et chaque exclusion porte un verbe d'action, un objet, une justification et une condition de réintégration. PASS.
- **G13** : 0 chiffre inventé ; les scores RICE sont explicitement qualifiés d'estimation qualitative du PM, pas de données mesurées ; le nombre d'offres (9) et la liste des programmes sont repris tels quels de project-context.md (BASE RÉELLE D'EMMANUEL). PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. PASS.
- **G17** : le séquencement (cercle fermé T&E en V1, arbitrage à 2 identités sur 9 programmes connus, ouverture marketplace conditionnée à un signal de demande) est spécifique à ce projet précis, non copiable par un agrégateur générique. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** `Read project-context.md` section "BASE RÉELLE D'EMMANUEL" confirme les 9 programmes (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko) et le schéma à 20 champs — l'épic 2 (catalogue) porte sur cette liste fermée et connue, pas une hypothèse ; `Read docs/legal/legal-strategy.md` lignes 140-155 (§7 checklist conformité) confirme que les documents de conformité (dont les fiches par programme) ne sont pas encore produits, ce qui justifie le maintien de l'épic 1 en Palier 0 bloquant.

---

## Hypothèses à valider

- `[HYPOTHÈSE]` Reach/Impact/Confiance des épics : estimation qualitative du PM en l'absence de données d'usage réelles (stade Idée/POC) ; à recalibrer dès les premières métriques de citation IA (cf. @data-analyst, tracking-plan issu des events de functional-specs.md).
- `[À VALIDER]` legal-strategy.md doit être réévalué par @legal en configuration "cercle fermé, liens personnels de T&E" (project-context.md CHOIX #2 note explicitement ce point comme non couvert) avant que l'épic 1 (pages de conformité) puisse être considéré comme définitivement calibré pour le V1 réel.

---
**Handoff → @ux, @design, @data-analyst, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/product/roadmap.md`
- Décisions prises : 7 épics V1 (cercle fermé T&E, catalogue des 9 offres réelles au schéma Emmanuel) priorisés MoSCoW+RICE ; séquencement en 4 paliers + palier de transition V1→V2 ; épic "Onboarding/soumission parrain" retiré du V1 et redocumenté en section 4 (V2, ouverture marketplace) ; 6 exclusions hors V1 documentées avec condition de réintégration.
- Points d'attention : épic 1 (pages de conformité, incluant les fiches par programme régulé) et la modélisation des 3 objets métier sont bloquants avant toute autre livraison ; le passage V1→V2 est conditionné à une réévaluation légale explicite (non faite à ce jour) et à un signal de demande observé, pas à une date ; legal-strategy.md et brand-platform.md restent à refresh par @legal/@creative-strategy suite à CHOIX #2 (signalé, pas corrigé ici, hors mandat).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de planification, aucun code produit).
---
