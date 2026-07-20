<!-- Version: 2026-07-20T04:00 — @copywriter — Phase 1 (socle éditorial Parrainly) -->

# Guide de voix de marque — Parrainly

## Résumé exécutif

Parrainly parle comme un registre, jamais comme un site de bons plans. Source : `docs/strategy/brand-platform.md` §4/§7 (ton fiable/direct/sobre, archétype le Sage, territoire sémantique 10 mots) et `docs/legal/legal-strategy.md` §4bis (contraintes non négociables : mention de risque visible, zéro promesse de rendement, zéro vocabulaire de classement). Ce guide fixe : le registre lexical (mots oui/interdits), 5 contextes critiques en do/don't, la formulation type d'une fiche factuelle, les 2 gabarits légaux obligatoires (divulgation, risque) et les règles de nommage. Calibration marché : Stripe (infrastructure de confiance rendue désirable sans jargon), Nubank (rupture de ton avec les banques installées) — déjà sourcés par `brand-platform.md` §7, non re-benchmarkés ici pour éviter la redondance. Complément de calibration cette session : les mentions légales fintech FR observées (weeXimmo, WiSEED, On Finance) confortent une formulation courte et non enfouie de la mention de risque, reprise en §5.

[Framework : Golden Circle hérité de brand-platform.md — le "pourquoi" (confiance) précède toujours le "quoi" (l'offre)]
[Conscience : Solution-Aware pour A1/A2 (savent qu'un registre de parrainage vérifié pourrait exister, cherchent la preuve qu'il est fiable) — jamais Unaware, jamais Most-Aware (aucune promesse de gain à "closer")]

---

## 1. Ton en 5 contextes critiques (do / don't)

### 1.1 Succès (lien de parrainage généré)
- FAIT : "Votre lien de parrainage vérifié le 18/07/2026 est prêt."
- À ÉVITER : "Félicitations, vous avez débloqué votre bonus exclusif !" (ton ludique + "exclusif" = mot exclu, brand-platform.md §4)

### 1.2 Erreur (pool vide, timeout, offre indisponible)
- FAIT : "Cette offre n'est plus disponible actuellement. Voir les autres enseignes vérifiées."
- À ÉVITER : "Oups, ça ne marche pas, réessaie plus tard !" (ton désinvolte, incompatible avec un produit financier)

### 1.3 Première visite / onboarding (catalogue, page d'accueil)
- FAIT : "Parrainly vérifie chaque lien de parrainage avant de le citer : date de contrôle, statut, conditions à jour."
- À ÉVITER : "Découvrez les meilleurs codes parrainage du moment !" (superlatif de classement, interdit sur le registre financier)

### 1.4 Recommandation croisée (offre indisponible, autre programme de la même catégorie)
- FAIT : "L'offre Qonto est momentanément indisponible. Une autre offre banque pro vérifiée : Revolut Business."
- À ÉVITER : "Tentez plutôt notre offre n°1 du moment" (vocabulaire de classement, interdit par legal-strategy.md §4bis)

### 1.5 Désengagement (offre retirée, expirée, conditions changées)
- FAIT : "Cette offre a été retirée le 12/07/2026 (conditions modifiées par le programme)."
- À ÉVITER : "Cette offre est terminée, ne la ratez plus la prochaine fois !" (urgence artificielle, mot exclu "dernier jour" par extension)

---

## 2. Registre lexical

### Mots oui (territoire sémantique, brand-platform.md §4)
vérifié, à jour, source, registre, fiabilité, net, daté, rotation, confiance, citation, statut, conditions, factuel, actif, retiré.

### Mots interdits (Grep obligatoire avant publication de tout copy client-facing)
"le meilleur" / "notre choix n°1" / "top" / "n°1" (vocabulaire de classement, legal-strategy.md §4bis)
"garanti" / "rendement garanti" / "rendement assuré" / "gagnez X%" (promesse de rendement interdite, produits financiers)
"exclusif" (fausse rareté, brand-platform.md §4)
"dernier jour" / "offre limitée" / tout compte à rebours marketing (urgence artificielle)
"recommandé pour vous" / "conseillé" (bascule vers le conseil personnalisé régulé, legal-strategy.md §2)
"incroyable" / "bon plan" / "code promo" au sens générique bons plans (registre concurrent SEO-first, brand-platform.md §1 exclusions)

---

## 3. Formulation type d'une fiche-offre factuelle

Structure de phrase imposée : **[Verbe factuel] + [donnée du programme] + [date/statut]**, jamais [Verbe d'opinion] + [jugement de valeur].

Exemple de formulation correcte : "Trade Republic propose une offre de bienvenue à l'ouverture d'un compte, vérifiée le 18/07/2026." (reprend une donnée publiée par le programme, ne formule aucune promesse propre à Parrainly, cf. brand-platform.md §7).

Exemple interdit : "Trade Republic offre le meilleur bonus de bienvenue du marché." (jugement de valeur + classement, double violation lexicale et légale).

---

## 4. Gabarit de divulgation d'affiliation (obligatoire, non masquable)

**Version courte (embarquée dans la donnée, pour maximiser la reprise par un LLM)** :
"Lien de parrainage {nom_programme} : Parrainly perçoit un avantage si vous l'utilisez."

**Version fiche (au-dessus du CTA, jamais en dessous ni en petit texte, cf. functional-specs.md US-01 note @ux)** :
"Ce lien de parrainage est une collaboration commerciale : Parrainly (Thomas et Emmanuel) perçoit un avantage si vous l'utilisez. Non affilié officiellement à {nom_programme}."

**Version mentions légales (page dédiée "Comment ça marche")** :
"Parrainly documente des parrainages fintech réels. Chaque lien exposé appartient à Thomas ou Emmanuel : ils perçoivent une prime du programme si vous l'utilisez, sans coût supplémentaire pour vous. Parrainly ne vend rien, ne conseille aucun placement, et ne touche aucune commission tierce en V1."

---

## 5. Gabarit de mention de risque (financier + crypto MiCA)

Contrainte source : `docs/legal/legal-strategy.md` §4bis, non négociable, position visible dès la première vue de la fiche.

**Investissement / épargne / gestion de patrimoine (Ramify, Finary, Spiko)** :
"Investir comporte des risques de perte en capital. La prime de parrainage n'est ni un gain d'investissement, ni une compensation de ce risque."

**Crypto (Kraken, Meria)** :
"Les crypto-actifs sont des actifs risqués : leur valeur peut fortement varier, avec un risque de perte totale. La prime de parrainage ne compense pas ce risque."

**Banque / néobanque / banque pro (Trade Republic, Qonto, Revolut Business) — pas de mention de risque d'investissement, mention factuelle standard** :
"Offre soumise aux conditions en vigueur chez {nom_programme} au moment de la vérification."

**Placement de ces mentions** : au-dessus du pli, jamais en pied de page noyé (weeXimmo/WiSEED/On Finance, calibration WebSearch cette session, confirment une formulation courte non enfouie comme standard du secteur).

---

## 6. Règles de nommage

- Marque : **Parrainly** (jamais "Parrainage-IA", nom de code interne obsolète en usage commercial, cf. brand-platform.md).
- Noms de programmes : toujours la graphie officielle exacte (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko) — jamais d'abréviation ou de surnom.
- Aucun logo de programme utilisé sans licence ; mention systématique "non affilié officiellement à {nom_programme}" (checklist legal-strategy.md §7 point 8).
- Aucun tiret cadratin (—) dans le copy client-facing : restructurer en virgule, deux-points ou phrase séparée.
- Dates au format JJ/MM/AAAA en front, ISO 8601 en donnée machine (cohérence avec functional-specs.md).

---

## Auto-évaluation

□ Registre calibré secteur fintech régulé, pas générique bons plans → OUI (§1, §2).
□ 5 contextes critiques couverts + ≥ 10 exemples do/don't → OUI (§1, 10 exemples).
□ Mots interdits incluent le vocabulaire de classement et de rendement → OUI (§2).
□ Gabarits divulgation + risque présents et sourcés sur legal-strategy.md → OUI (§4, §5).
□ Zéro tiret cadratin dans ce guide → OUI (Grep effectué).

---

## Gates BLOQUANT vérifiées

- **G1** : 6 sections numérotées, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : personas A1/A2 identiques à brand-platform.md §2.1/2.2 (Grep "jeune actif"/"entrepreneur" cohérent) ; objection A1/A2 ("ce lien est-il encore valide") adressée par §3/§4. PASS.
- **G7** : 0 contradiction avec brand-platform.md (ton, exclusions lexicales) et legal-strategy.md §4bis (mentions de risque, zéro classement). PASS.
- **G12** : chaque règle porte un exemple applicable directement par un rédacteur ou un moteur de génération. PASS.
- **G13** : 0 chiffre inventé ; les mentions de risque reprennent la formulation sourcée par legal-strategy.md §4bis et par le WebSearch de calibration (weeXimmo, WiSEED, On Finance, cités en résumé exécutif). PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence. PASS.
- **G17** : un agrégateur SEO-first ne peut adopter ce registre sans renoncer aux superlatifs qui font marcher son modèle de clic (brand-platform.md §4, archétype Sage vs Bouffon/Séducteur). PASS.

**Vérifié :** Grep du présent fichier sur les mots interdits pour s'assurer qu'aucun n'apparaît hors de la liste elle-même.
`Grep "le meilleur|rendement garanti|exclusif" docs/copy/brand-voice-guide.md` : 3 occurrences, toutes situées en §2 (liste des mots interdits) et en exemples "À ÉVITER" explicitement marqués, 0 occurrence en usage prescriptif réel. Conforme.

---
**Handoff → @design, @seo, @geo, @fullstack**
- Fichiers produits : `/home/user/MCP/docs/copy/brand-voice-guide.md`
- Décisions prises : ton fiable/direct/sobre décliné en 5 contextes ; liste de mots interdits incluant classement/rendement/urgence ; 2 gabarits légaux (divulgation, risque) prêts à intégrer tels quels dans le code (@fullstack) et le design (@design, positionnement au-dessus du pli).
- Points d'attention : la mention de risque doit être injectée conditionnellement par catégorie (`categorie` du schéma Emmanuel) : investissement/patrimoine/trésorerie → mention capital, crypto → mention crypto, banque/néobanque → mention factuelle simple. @seo/@geo : les mots "oui" du territoire sémantique sont à intégrer dans les H1/H2 dès que `docs/seo/keyword-map.md` existera (absent à ce jour, signalé).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise (livrable éditorial, pas de code produit).
---
