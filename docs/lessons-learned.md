<!-- Version: 2026-07-20 — @orchestrator — Mémoire organisationnelle (format v2) -->
# Lessons Learned — Parrainly

> Cap : 80 lignes (CLAUDE.md commandement 8). TTL learnings : 5 sessions OU 90 jours → promote en règle ou archive.
> Un learning est "terminé" quand Statut correction = `fait` ET Statut propagation = `propagé`.
> Gate bloquante en reprise : propager les P0/P1 `non-propagé` AVANT tout nouveau travail.

| # | Date | Learning | Catégorie | Sévérité | Cible propagation | Fichiers impactés | Statut correction | Statut propagation | Détecté par | Notes |
|---|------|----------|-----------|----------|-------------------|-------------------|-------------------|--------------------|-------------|-------|
| L1 | 2026-07-20 | Le `.xlsx` source est binaire : l'outil Read des agents ne peut pas le lire, ce qui bloque le remplissage des fiches-offres avec les vraies données (montants, conditions). | pattern | P1 | prompts / fullstack | data/base-parrainage.json, data/programmes.csv | fait | propagé | @copywriter | Résolu par export orchestrateur xlsx→JSON+CSV. Les agents lisent désormais `data/base-parrainage.json`. À citer dans les prompts aval au lieu du xlsx. |
| L2 | 2026-07-20 | Secteur financier régulé : le vocabulaire de classement ("le meilleur", "recommandé") fragilise à la fois la légalité publicitaire ET la posture d'apporteur non régulé. | règle | P1 | copywriter / design / ux | docs/copy/brand-voice-guide.md, docs/legal/legal-strategy.md | fait | propagé | @legal + @copywriter | Intégré comme mots interdits dans brand-voice-guide + contraintes UX. À maintenir sur tout copy fintech. |

<!-- Ajouter les nouveaux learnings au-dessus de cette ligne. P0/P1 non-propagés = gate bloquante en reprise. -->
