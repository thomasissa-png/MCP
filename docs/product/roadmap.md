<!-- Version: 2026-07-20T00:00 — @product-manager — Roadmap Phase 0 (scope V1 complet, épics par dépendances) -->

# Roadmap — Parrainage-IA

## Résumé exécutif

- Scope V1 complet en 8 épics (pas de MVP tronqué) : catalogue d'offres, onboarding/soumission parrain, moteur de rotation/attribution, vérification de fraîcheur automatisée, API JSON publique, tracking d'attribution IA→conversion, back-office admin, pages de conformité.
- Priorisation MoSCoW + RICE (RICE = estimation qualitative du PM sur échelle 1-5 par facteur, Effort non pondérant car quasi nul en exécution IA — cf. CLAUDE.md commandement 5).
- Séquencement par dépendances, pas par sprints : les pages de conformité et les objets métier (Enseigne/Offre, Parrain) sont le socle bloquant de tout le reste.
- Hors V1 explicite : verticale banque/fintech (statut ORIAS non instruit), MCP (canal B2C non pertinent, cf. faisabilite-geo-parrainage-ia.md), paiement automatisé des commissions parrains (KYC/versement délégué à un prestataire, V1.5), extension navigateur/GPT Store.

---

## 1. Épics V1 — priorisation MoSCoW + RICE

RICE : Reach/Impact/Confiance sur échelle 1-5 (estimation qualitative PM, pas une donnée mesurée), Effort non pondérant (mindset IA, cf. CLAUDE.md commandement 5) → Score = R×I×C.

| # | Épic | MoSCoW | Reach | Impact | Confiance | Score RICE | Justification |
|---|---|---|---|---|---|---|---|
| 1 | Pages de conformité (CGU, confidentialité, mentions légales, divulgation) | Must | 5 | 5 | 5 | 125 | Bloquant légal avant toute mise en ligne publique (legal-strategy.md §7, 10 documents requis) ; sans ce socle, aucune autre page ne peut être publiée. |
| 2 | Catalogue d'offres (pages par enseigne, schema.org) | Must | 5 | 5 | 4 | 100 | Actif central du canal GEO (faisabilite-geo-parrainage-ia.md) ; sans catalogue publié, rien à citer par une IA. |
| 3 | Moteur de rotation/attribution | Must | 4 | 5 | 3 | 60 | Cœur du modèle (product-vision.md §2) ; confiance à 3 car le plafond exact par enseigne reste `[À VALIDER]`. |
| 4 | Onboarding/soumission parrain | Must | 4 | 4 | 4 | 64 | Sans parrains inscrits, le pool de rotation est vide (résout le risque n°1 identifié par @growth : plafond du modèle T&E seul). |
| 5 | Vérification de fraîcheur automatisée | Must | 4 | 5 | 3 | 60 | KPI de survie du modèle (brand-platform.md §3 preuve Fraîcheur, growth §3.3) ; confiance à 3 tant que la fréquence de re-vérification n'est pas chiffrée. |
| 6 | Tracking d'attribution IA→conversion | Must | 4 | 5 | 3 | 60 | Sans traçabilité, ni commission calculable ni KPI North Star mesurable (project-context.md). |
| 7 | API JSON publique | Should | 3 | 4 | 4 | 48 | Actif pivot identifié par @ia (architecture-mcp-parrainage-ia.md) ; canal secondaire au lancement, priorité juste sous le catalogue web. |
| 8 | Back-office admin | Should | 3 | 3 | 5 | 45 | Nécessaire pour opérer (valider parrains, gérer plafonds par enseigne) mais peut suivre de peu le catalogue si l'équipe (Thomas/Emmanuel) opère manuellement au tout début du POC. |

**Chalengé et retenu tel quel** : aucun épic proposé n'a été retiré — chacun est directement rattaché soit à une obligation légale bloquante (pages de conformité), soit à un objet métier structurant du modèle marketplace (product-vision.md §4), soit au canal de distribution validé (@geo). Un épic "extension navigateur / GPT Store" a été explicitement écarté du V1 : @geo le classe canal secondaire opportuniste sans traction actuelle (faisabilite-geo-parrainage-ia.md §2).

---

## 2. Séquencement par dépendances

Pas de découpage en semaines/sprints (CLAUDE.md commandement 5). L'ordre ci-dessous reflète des dépendances techniques et légales strictes, pas un calendrier.

**Palier 0 — Socle bloquant (aucune autre publication possible avant)**
- Épic 1 (Pages de conformité) : dépend de rien, doit précéder toute mise en ligne publique (legal-strategy.md §7 : "aucun de ces documents n'existe encore, tous à produire avant mise en ligne publique").
- Modélisation des 3 objets métier (Enseigne/Offre, Parrain, Attribution/Conversion, product-vision.md §4) : dépend de rien, socle technique de tous les épics suivants.

**Palier 1 — Alimentation du registre (dépend du Palier 0)**
- Épic 2 (Catalogue d'offres) : dépend de la modélisation Enseigne/Offre + pages de conformité (mention "non affilié officiellement", divulgation embarquée).
- Épic 4 (Onboarding/soumission parrain) : dépend de la modélisation Parrain + CGU internes parrains (pages de conformité, item 9).

**Palier 2 — Mécanique cœur (dépend du Palier 1)**
- Épic 3 (Moteur de rotation/attribution) : dépend d'avoir au moins un catalogue d'offres ET un pool de parrains soumis (épics 2 et 4) pour avoir une matière à faire tourner.
- Épic 5 (Vérification de fraîcheur automatisée) : dépend du catalogue d'offres existant (épic 2) ; peut être développée en parallèle de l'épic 3.

**Palier 3 — Exposition et mesure (dépend du Palier 2)**
- Épic 7 (API JSON publique) : dépend du moteur de rotation/attribution (épic 3) pour exposer des liens réellement attribués, pas des liens statiques.
- Épic 6 (Tracking d'attribution IA→conversion) : dépend de l'épic 3 (objet Attribution/Conversion existant) pour avoir un événement à tracker.

**Palier 4 — Opération (peut démarrer dès le Palier 1, doit être prêt avant l'ouverture du catalogue à des parrains tiers)**
- Épic 8 (Back-office admin) : dépend des objets métier (Palier 0) ; nécessaire pour valider manuellement les premières soumissions (épic 4) et gérer les plafonds par enseigne (épic 3), donc doit être livré avant que le pool dépasse Thomas/Emmanuel.

---

## 3. Hors V1 (explicitement exclu, avec raison business)

| Exclu | Raison business | Condition de réintégration |
|---|---|---|
| Verticale banque/fintech (Boursorama, Fortuneo, BNP...) | Statut IOBSP/ORIAS non instruit ; exercer sans immatriculation = délit pénal (legal-strategy.md §2) | @legal instruit et tranche le statut d'intermédiaire avant tout ajout de programme bancaire au catalogue |
| Serveur MCP grand public comme canal d'acquisition | Adoption grand public quasi nulle en 2026, aucune traction B2C observée (faisabilite-geo-parrainage-ia.md §2) | Réévaluer si une plateforme IA majeure lance un catalogue de connectors grand public en 1 clic (signal à surveiller, pas hypothèse de travail) |
| Paiement automatisé des commissions parrains (versement direct intégré) | KYC bancaire (IBAN, identité) + conformité anti-blanchiment nécessitent un prestataire de paiement dédié (legal-strategy.md §6b recommande Stripe Connect ou équivalent) ; le POC peut opérer un versement manuel via back-office | Intégrer un prestataire de paiement en V1.5 une fois le volume de parrains tiers dépassant Thomas/Emmanuel justifie l'automatisation |
| Extension navigateur / App ChatGPT / Gemini Extension | Canal secondaire opportuniste sans priorité de lancement (faisabilite-geo-parrainage-ia.md §2, canal (c)) | Une fois le catalogue et l'API JSON stabilisés, activer en V1.5 en réutilisant la même donnée |
| Comparaison/conseil personnalisé "meilleur parrainage pour vous" | Rapproche le produit de la frontière indicateur/IOBSP dès qu'un accompagnement dépasse le simple lien exposé (legal-strategy.md §2) | À ne réintroduire qu'après validation juridique explicite du statut, en lien avec la réintégration de la verticale banque |

---

## Gates BLOQUANT vérifiées

- **G1** : 3 sections numérotées, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff présent en fin de document. PASS.
- **G5** : N/A documenté — livrable de priorisation/planification, pas de copy client-facing adressant directement un persona ; les épics restent reliés aux personas via product-vision.md.
- **G7** : 0 contradiction avec brand-platform.md (périmètre hors-régulé), legal-strategy.md (checklist §7 reprise comme épic 1), project-synthesis.md (MCP hors V1 confirmé), faisabilite-geo-parrainage-ia.md (API JSON + catalogue comme canal principal). PASS.
- **G12** : chaque épic et chaque exclusion porte un verbe d'action, un objet, une justification et une condition de réintégration. PASS.
- **G13** : 0 chiffre inventé ; les scores RICE sont explicitement qualifiés d'estimation qualitative du PM, pas de données mesurées. PASS.
- **G15** : Grep effectué sur les patterns interdits, absents. PASS.
- **G17** : le séquencement (pages de conformité en palier 0, plafond configurable par enseigne) est spécifique aux contraintes légales et au modèle marketplace de ce projet précis. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** `Read docs/legal/legal-strategy.md` lignes 140-155 (§7 checklist conformité) confirme que les 10 documents de conformité ne sont pas encore produits et sont un prérequis explicite avant mise en ligne publique — ce qui justifie le placement de l'épic 1 en Palier 0 bloquant, cohérent avec le séquencement proposé ci-dessus.

---

## Hypothèses à valider

- `[HYPOTHÈSE]` Reach/Impact/Confiance des épics : estimation qualitative du PM en l'absence de données d'usage réelles (stade Idée/POC) ; à recalibrer dès les premières métriques de citation IA (cf. @data-analyst, tracking-plan issu des events de functional-specs.md).

---
**Handoff → @ux, @design, @data-analyst, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/product/roadmap.md`
- Décisions prises : 8 épics V1 complets priorisés MoSCoW+RICE ; séquencement en 5 paliers par dépendances ; 5 exclusions hors V1 documentées avec condition de réintégration.
- Points d'attention : épic 1 (pages de conformité) et la modélisation des 3 objets métier sont bloquants avant toute autre livraison ; le back-office admin (épic 8) doit être prêt avant l'ouverture du catalogue à des parrains tiers au-delà de Thomas/Emmanuel.
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise à ce stade (livrable de planification, aucun code produit).
---
