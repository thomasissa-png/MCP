<!-- Version: 2026-07-20T04:00 — @copywriter — Phase 1 (copy homepage Parrainly) -->

# Copy homepage — Parrainly

[Framework : AIDA, adapté sobre (pas d'urgence artificielle en Intérêt/Désir, cf. brand-voice-guide.md §2)]
[Conscience : Problem-Aware pour la majorité des visiteurs venus d'une citation IA (savent qu'un lien de parrainage peut être mort, ne connaissent pas encore Parrainly) ; Solution-Aware pour ceux qui arrivent en recherche directe "parrainage {programme} vérifié"]

## Résumé exécutif

Copy de la page d'accueil, calibrée sur brand-platform.md (tagline, promesse, ton) et legal-strategy.md (zéro classement, zéro promesse de rendement). La FAQ est structurée en question/réponse courte pour être citée directement par un moteur de réponse IA (schema.org FAQPage, cf. `docs/geo/faisabilite-geo-parrainage-ia.md`, canal principal = contenu web structuré). Objection principale traitée dans le CTA final : "comment je sais que ce lien n'est pas un montage limite" (brand-platform.md §2.1).

---

## 1. Hero

**H1** : "Le parrainage, vérifié avant d'être cité."
(tagline retenue, brand-platform.md §5, reprise à l'identique en H1 : cohérence marque/H1 maximale)

**Sous-titre** : "Parrainly vérifie chaque lien de parrainage fintech avant de le recommander : date de contrôle, statut, conditions à jour. Trade Republic, Qonto, Kraken et les autres, sans lien mort ni condition expirée."

**CTA hero** : "Voir les offres vérifiées"

---

## 2. Comment ça marche

**Titre de section** : "Comment ça marche"

1. "Vous demandez un parrainage à votre assistant IA, ou vous consultez directement le catalogue Parrainly." [MOT-CLÉ SEO À INTÉGRER : `docs/seo/keyword-map.md` absent à ce jour, signalé à @seo]
2. "Chaque offre affiche sa date de dernière vérification et son statut : actif, en attente, retiré."
3. "Vous récupérez un lien attribué à Thomas ou Emmanuel, qui détiennent réellement les 9 programmes du catalogue."
4. "Vous obtenez l'avantage publié par le programme si vous ouvrez le compte ou souscrivez au produit."

---

## 3. Pourquoi la vérification

**Titre de section** : "Pourquoi la date de vérification change tout"

"Un lien de parrainage fintech n'est pas un code promo classique : une condition ratée (montant minimum de dépôt, durée de détention) transforme une prime attendue en zéro. Sur Trade Republic, Kraken ou Qonto, les conditions changent régulièrement. Parrainly retire une offre du registre dès qu'elle est signalée morte, expirée ou modifiée, avant de la reproposer."

3 preuves (reprises de brand-platform.md §3, non réinventées) :
- "Vérification : statut et date de contrôle sur chaque offre."
- "Fraîcheur : retrait automatique d'une offre signalée obsolète."
- "IA-native : structure lisible par les moteurs de réponse, pas seulement par un humain qui clique."

---

## 4. Preuve (factuelle, zéro témoignage fictif)

"Le registre couvre 9 programmes fintech réels au lancement : Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko, répartis sur 6 catégories (finance personnelle, investissement, gestion de patrimoine, placement de trésorerie, services entrepreneur, crypto)."

(Aucun chiffre de trafic, conversion ou avis client n'est affiché : aucune donnée de ce type n'existe encore au stade V1 cercle fermé, cf. project-context.md. Zéro invention conforme à la règle anti-témoignage.)

---

## 5. FAQ (orientée AEO/GEO, structure Question/Réponse citable)

**Q : Qu'est-ce que Parrainly ?**
R : "Parrainly est un registre qui vérifie des liens de parrainage fintech (néobanque, investissement, crypto, banque pro) avant de les recommander, avec une date de contrôle sur chaque offre."

**Q : Est-ce que Parrainly est affilié à Trade Republic, Qonto ou Kraken ?**
R : "Non. Parrainly n'est affilié officiellement à aucun des programmes listés. Les liens exposés appartiennent à Thomas ou Emmanuel, qui perçoivent un avantage du programme si vous les utilisez."

**Q : Comment Parrainly vérifie-t-il un lien de parrainage ?**
R : "Chaque offre porte un statut (actif, en attente, retiré) et une date de dernière vérification. Une offre signalée morte, expirée ou dont les conditions ont changé est retirée du registre avant d'être re-proposée."

**Q : Est-ce que Parrainly recommande le meilleur parrainage pour moi ?**
R : "Non. Parrainly décrit les offres telles que publiées par chaque programme, sans classement ni conseil personnalisé. Chaque décision d'ouvrir un compte ou d'investir reste la vôtre."

**Q : Investir ou détenir des crypto-actifs via un lien de parrainage comporte-t-il un risque ?**
R : "Oui. Investir comporte des risques de perte en capital. Les crypto-actifs sont des actifs risqués dont la valeur peut fortement varier. La prime de parrainage ne compense aucun de ces risques."

---

## 6. CTA de conviction en fin de parcours

**Titre de section** : "Avant d'ouvrir un compte"

"Vous avez déjà recoupé 2-3 sources vous-même ? Parrainly vous donne la date de dernière vérification en plus, pour trancher sans revérifier à la main."

**CTA final** : "Consulter le registre vérifié"

(Traite l'objection principale A1/A2 : "comment je sais que ce lien n'est pas un montage limite" en rappelant que la vérification est datée et vérifiable, pas un argument de vente.)

---

## Gates BLOQUANT vérifiées

- **G1** : 6 sections, 0 section < 2 lignes, 0 `[TODO]`. PASS.
- **G3** : bloc Handoff en fin de document. PASS.
- **G5** : objection A1/A2 ("ce lien n'est pas un montage limite", brand-platform.md §2.1/§2.2) traitée en §6 et en FAQ §5. PASS.
- **G7** : H1 = tagline exacte de brand-platform.md §5 ; 3 preuves reprises identiques à brand-platform.md §3 ; mention de risque conforme legal-strategy.md §4bis. PASS.
- **G12** : chaque section a un titre + un texte directement intégrable par @fullstack/@design, sans réécriture nécessaire. PASS.
- **G13** : 0 chiffre inventé (9 programmes et 6 catégories confirmés par project-context.md/brand-platform.md ; aucune métrique de trafic ou avis fictif). PASS.
- **G15** : Grep `[À REMPLIR`, `[PLACEHOLDER`, `[TODO`, `[XX`, `[INSÉRER` : 0 occurrence. Seule annotation volontaire : `[MOT-CLÉ SEO À INTÉGRER]` (signalement légitime, keyword-map.md absent). PASS.
- **G17** : le combo H1 tagline + FAQ structurée AEO + zéro classement n'est pas copiable par un agrégateur SEO-first sans renoncer à son registre de superlatifs. PASS.
- **G_PROOF** : voir bloc `Vérifié :` ci-dessous.

**Vérifié :** Grep de la FAQ §5 pour confirmer l'absence de vocabulaire de classement malgré la question piège posée ("le meilleur parrainage pour moi").
`Grep "le meilleur|recommandé pour vous|garanti" docs/copy/homepage-copy.md` : la question de la FAQ contient "meilleur" (posée volontairement pour y répondre par la négative), 0 occurrence dans une réponse affirmative ou un titre de section. La réponse à cette question dit explicitement "Non", conforme à legal-strategy.md §4bis.

---
**Handoff → @seo, @geo, @fullstack, @design**
- Fichiers produits : `/home/user/MCP/docs/copy/homepage-copy.md`
- Décisions prises : H1 = tagline exacte de la marque (cohérence maximale) ; FAQ structurée en 5 questions dont 1 question-piège ("le meilleur parrainage pour moi") volontairement posée pour affirmer la posture non-conseil ; CTA final adressant l'objection de confiance A1/A2 sans argument de vente.
- Points d'attention : zone `[MOT-CLÉ SEO À INTÉGRER]` en §2 point 1, `docs/seo/keyword-map.md` absent à ce jour, à produire par @seo puis à réintégrer ici ; @geo : structurer la FAQ en schema.org FAQPage dès l'implémentation (cohérent avec `docs/geo/faisabilite-geo-parrainage-ia.md`).
- **Actions infra requises** : Aucune action Cloudflare/GitHub requise (livrable éditorial).
---
