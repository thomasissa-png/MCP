# Audit juridique ciblé — Retrait des noms propres (T2) — Parrainly LIVE

> Périmètre : impact du retrait de « Thomas » et « Emmanuel » du client-facing sur 3 obligations
> légales distinctes qui les mentionnent aujourd'hui : divulgation d'affiliation, mentions légales
> (LCEN art. 6-III), politique de confidentialité (responsable de traitement RGPD art. 13).
> Ce document est un draft de référence, pas un avis juridique formel — validation par un avocat
> recommandée avant toute mise en ligne publique réelle (cf. `docs/legal/legal-strategy.md`).

## Résumé exécutif — risques en 5 points

1. **La divulgation d'affiliation N'A PAS besoin de noms propres pour être conforme.** La loi
   n° 2023-451 (influence commerciale) et la directive Omnibus exigent de dire QU'il y a un lien
   commercial et QUI en bénéficie, pas de nommer une personne physique par son prénom. « L'éditeur
   de ce site perçoit un avantage » satisfait l'obligation, À CONDITION que « l'éditeur » soit
   identifiable ailleurs (mentions légales) — voir point 2. Retrait des noms = **compatible**.
2. **Les mentions légales (LCEN art. 6-III), elles, EXIGENT une identification réelle de l'éditeur.**
   L'exception d'anonymat de l'art. 6-III-2 LCEN ne s'applique qu'aux éditeurs **non professionnels**
   diffusant du contenu à portée personnelle limitée (cercle familial/amical). Thomas et Emmanuel
   perçoivent des commissions sur un site public monétisé : cette activité est **professionnelle**,
   l'exception ne joue pas. Supprimer les noms SANS rien mettre derrière (pas de société créée, pas
   de LEGAL_EDITOR_NAME renseigné) est un **P0 bloquant** : sanction pénale 1 an d'emprisonnement +
   75 000 € pour personne physique/dirigeant (art. 6-VI LCEN).
3. **La seule voie propre pour concilier « zéro prénom » ET conformité LCEN est la création d'une
   structure (société ou EI avec nom commercial distinct)** : les mentions légales identifient alors
   la RAISON SOCIALE (SIREN, forme juridique, siège), pas les prénoms des fondateurs. C'est une
   décision business (statut juridique), pas une simple reformulation de copy — `[À TRANCHER PAR LE
   FONDATEUR]`, déjà posée comme `[À VALIDER]` dans `legal-strategy.md` mais devenue **bloquante**
   du fait de T2.
4. **La politique de confidentialité (responsable de traitement RGPD art. 13) suit la même logique**
   que les mentions légales : le responsable doit être identifiable et contactable. Formulation
   possible sans prénoms si elle renvoie vers l'entité identifiée dans les mentions légales — mais
   pas d'entité identifiée nulle part = même trou de conformité que le point 2, dupliqué.
5. **Le code actuel est à deux vitesses face à T2.** `mentions-legales/page.tsx` a déjà un
   mécanisme d'échappement propre (`LEGAL_EDITOR_NAME` via env, fallback documenté) mais son
   fallback par défaut NOMME Thomas et Emmanuel. `confidentialite/page.tsx`, `DisclosureBanner.tsx`,
   `divulgation/page.tsx` et `Footer.tsx` codent le prénom **en dur, sans mécanisme de substitution**.
   Un simple find/replace texte réglerait la conformité de la divulgation (point 1) mais PAS celle
   des mentions légales/RGPD tant que `LEGAL_EDITOR_NAME` n'est pas renseigné avec une vraie entité.

**Verdict : retrait des noms propres compatible avec la conformité, SOUS CONDITION d'une décision
de structure juridique (société/EI à nom commercial) — pas une simple reformulation de texte.**

---

## Re-score round 2 (post-correctifs, pilote non-public) : 7/10

Correctifs vérifiés par re-lecture de `divulgation/page.tsx`, `mentions-legales/page.tsx`,
`confidentialite/page.tsx` :

- **Divulgation** (`divulgation/page.tsx` L21, L25) : 0 prénom, formule « l'éditeur de ce site »
  reprise à l'identique dans les deux paragraphes concernés. **Conforme, sans condition** (inchangé
  par rapport au round 1, confirmé — cf. P1-1 traité).
- **Mentions légales** (`mentions-legales/page.tsx` L18-25) : fallback désormais neutre
  (« l'éditeur du site, identité définitive à préciser avant la mise en ligne publique »), **0
  personne physique nommée**, et surtout accompagné d'un **commentaire code explicite** qui trace
  le TODO raison sociale jusqu'à ce document (« cf. docs/audit/legal-audit-2.md, P0-1 ») et
  qualifie explicitement le pilote de **non-public (workers.dev, non indexé)**. C'est exactement
  la résolution recommandée en round 1 : ne pas combler artificiellement le vide avec un texte
  faussement définitif, documenter la dette et la condition de levée.
- **Confidentialité** (`confidentialite/page.tsx` L19-28) : P0-2 résolu — utilise maintenant le
  même mécanisme `LEGAL_EDITOR_NAME` que les mentions légales (import identique), même fallback
  neutre, et renvoie explicitement vers `/mentions-legales` pour l'identité complète au lieu de
  dupliquer un nom en dur. Les deux pages sont désormais synchronisées sur une seule source de
  vérité (`LEGAL_EDITOR_NAME`), ce qui élimine le risque de désynchronisation relevé en round 1.

**Le point dur (« raison sociale avant lancement public ») est CONTENU, pas résolu — et c'est la
bonne posture pour un pilote non-public :**
1. Le TODO est documenté dans le code (pas seulement dans ce livrable), avec traçabilité explicite
   vers l'audit — réduit le risque d'oubli au moment du passage en public.
2. La formulation ne prétend PAS être une identification LCEN définitive : elle dit explicitement
   « identité définitive à préciser avant la mise en ligne publique », ce qui est honnête et non
   trompeur (contrairement à un texte générique qui prétendrait satisfaire l'art. 6-III sans le
   faire réellement).
3. **Nuance juridique importante, non éliminée par le statut « pilote »** : une URL Workers.dev
   accessible sans authentification, même non indexée et non promue, reste techniquement un
   service de communication au public en ligne au sens de la LCEN (le critère est l'accessibilité,
   pas l'indexation ni le volume de trafic). Le TODO documenté est un **atténuant de bonne foi**
   (absence d'intention de contourner la loi, correctif déjà engagé) mais **ne vaut pas exemption
   légale** si un tiers accède au site aujourd'hui et exige l'identification. Le risque réel est
   donc **faible en pratique** (pilote non promu, aucune action GEO/growth/indexation lancée à ce
   stade) mais **pas nul en droit**.

**Condition de clôture définitive (au-delà du round 2)** : avant toute action qui augmente
l'exposition réelle du pilote (indexation SEO/GEO, campagne growth, ouverture publique annoncée),
la raison sociale doit être tranchée et injectée dans `LEGAL_EDITOR_NAME` — ce n'est pas négociable
à ce stade-là, contrairement au stade actuel (pilote silencieux) où le TODO documenté suffit à
contenir le risque.

---

## Note /10

**4/10 — conformité de l'état actuel du code face à T2, si T2 est exécuté comme un simple
retrait de texte (sans trancher la structure juridique).**

- Divulgation seule (si isolée) : 9/10, la reformulation générique est juridiquement solide.
- Mentions légales + confidentialité (si les noms sont retirés sans qu'une entité les remplace,
  ni env var renseignée) : 1-2/10, trou d'identification LCEN/RGPD, risque pénal réel documenté.
- Score global pondéré par la gravité du pire cas (LCEN), pas par la moyenne : **4/10**.

Si la décision de structure est prise et `LEGAL_EDITOR_NAME` (+ `LEGAL_PUBLICATION_DIRECTOR`,
`LEGAL_HOST`) renseignés avec une vraie raison sociale avant mise en ligne publique : **8/10**
(reste `[À VÉRIFIER PAR UN JURISTE]` sur le fond du statut réglementé, cf. `legal-strategy.md` §2,
non affecté par T2).

---

## Findings P0/P1

### P0-1 — Combler le trou d'identification LCEN avant toute suppression des prénoms dans les mentions légales
**Verbe+objet** : Trancher la structure juridique porteuse (société créée / EI à nom commercial
distinct / statu quo personnes physiques nommées) et renseigner `LEGAL_EDITOR_NAME` (+
`LEGAL_PUBLICATION_DIRECTOR`, `LEGAL_HOST`) en conséquence avant toute mise en ligne publique.
**Critère de done** : `mentions-legales/page.tsx` affiche une identité réelle et vérifiable
(raison sociale + SIREN + siège, OU nom/prénom/domicile si personnes physiques), jamais le
fallback actuel « ses deux parrains fondateurs, Thomas et Emmanuel » ni un texte 100% générique
sans aucune entité identifiée derrière.
**Pourquoi bloquant** : sans cela, retirer les prénoms transforme un texte conforme (mais qui
contredit T2) en un texte NON conforme à l'art. 6-III LCEN (défaut d'identification de l'éditeur),
sanctionné pénalement (1 an, 75 000 €, art. 6-VI LCEN). Ce n'est pas un risque théorique : c'est
l'obligation la plus stricte des trois textes audités.

### P0-2 — Aligner `confidentialite/page.tsx` sur le même mécanisme que `mentions-legales/page.tsx`
**Verbe+objet** : Remplacer la ligne 19 codée en dur (« Parrainly est édité par Thomas et
Emmanuel ») par une référence à `LEGAL_EDITOR_NAME` (même pattern conditionnel que
`mentions-legales/page.tsx`), ou par un renvoi explicite « voir Mentions légales » pour éviter
de dupliquer/désynchroniser l'identité du responsable de traitement entre les deux pages.
**Critère de done** : la politique de confidentialité n'affirme jamais un nom en dur non gouverné
par la même variable que les mentions légales ; les deux pages restent cohérentes entre elles à
tout moment (aujourd'hui elles ne le sont déjà pas : `mentions-legales` a un mécanisme
conditionnel, `confidentialite` non — bug de conformité indépendant de T2, aggravé par T2).

### P0-3 — Ne pas confondre « retirer le prénom du texte visible » et « rendre l'éditeur non identifiable »
**Verbe+objet** : Documenter, avant tout retrait de code, que la conformité RGPD art. 13
(identité + coordonnées du responsable de traitement) et la conformité LCEN reposent sur le MÊME
principe : une entité doit être identifiable QUELQUE PART dans les documents légaux, même si elle
n'apparaît pas dans les pages produit/marketing.
**Critère de done** : aucun des 4 fichiers legal (`mentions-legales`, `confidentialite`,
`divulgation`, `cgu`) ne se retrouve, une fois T2 appliqué, sans aucune mention d'une entité
identifiée (personne physique nommée ou société) — la disparition doit être compensée, pas nette.

### P1-1 — Reformuler `DisclosureBanner.tsx`, `divulgation/page.tsx` et `Footer.tsx` sans prénom (compatible)
**Verbe+objet** : Remplacer « Thomas et Emmanuel » / « Thomas ou Emmanuel » par « l'éditeur de ce
site » / « Parrainly » dans les 3 fichiers (bandeau, page divulgation, footer).
**Critère de done** : la mention de divulgation reste immédiate, claire, avant le lien cliquable
(inchangé), et le mot qui désigne le bénéficiaire (« l'éditeur ») renvoie implicitement vers la
page mentions légales où l'éditeur réel est identifié (P0-1 résolu en amont).
**Pourquoi P1 et pas P0** : ce changement est juridiquement sûr EN LUI-MÊME (la divulgation
n'exige pas de prénom) ; il ne devient un problème que combiné à P0-1 non résolu.

### P1-2 — Vérifier la cohérence FAQ enrichie et `lib/ai/site.ts` / `llms.txt` après retrait
**Verbe+objet** : Une fois la formulation neutre validée sur les 4 textes légaux, appliquer la
même règle terminologique (« l'éditeur du site », jamais de prénom) aux 8 occurrences de
`faq-enrichie.ts`, à `lib/ai/site.ts` et `llms.txt/route.ts`, pour qu'un assistant IA qui cite ces
sources restitue une divulgation cohérente et jamais un prénom isolé sans le contexte de
l'éditeur identifié.
**Critère de done** : 0 occurrence de « Thomas »/« Emmanuel » sur l'ensemble du client-facing,
et la formulation retenue est identique mot pour mot dans les 4 textes légaux ET dans la FAQ/JSON
consommée par les IA (source de vérité unique, pas de reformulation divergente par fichier).

---

## Formulations conformes recommandées (sans noms propres)

### Divulgation d'affiliation (`src/app/divulgation/page.tsx`)
Remplacer le paragraphe L19-22 par :
> « Parrainly référence des programmes de parrainage réels (banques, plateformes d'investissement,
> plateformes crypto, services aux entreprises). Chaque fiche que vous consultez contient un lien
> de parrainage personnel appartenant à l'éditeur de ce site. »

Et L24-26 :
> « Ce que ça signifie concrètement : si vous vous inscrivez à un programme via un des liens
> présentés sur ce site, l'éditeur de ce site reçoit un avantage (prime en argent, mois offert,
> selon le programme), exactement comme n'importe quel parrainage personnel entre proches. »

**Condition de validité** : la page mentions légales, référencée en pied (`LegalContact` +
lien Mentions légales déjà présent en footer), doit permettre à tout moment de retrouver QUI est
« l'éditeur de ce site » avec une identité réelle (P0-1). Sans cette condition remplie, la formule
reste correcte en surface mais s'appuie sur un maillon cassé.

### Mentions légales (`src/app/mentions-legales/page.tsx`)
Le mécanisme conditionnel existant (`LEGAL_EDITOR_NAME`) est la bonne architecture — le problème
n'est pas le code, c'est le FALLBACK et la valeur réelle à renseigner. Deux formulations selon la
décision fondateur (voir « Points à trancher ») :

- **Si société/EI créée** (recommandé pour retirer durablement les prénoms) :
  > « Le site Parrainly est édité par [Raison sociale], [forme juridique], au capital de [X] €,
  > immatriculée au RCS de [ville] sous le n° [SIREN], dont le siège social est situé [adresse]. »
  → `LEGAL_EDITOR_NAME` = cette phrase ou la raison sociale seule, injectée dans le template
  existant. **Zéro prénom, LCEN respecté** (identification par personne morale).

- **Si statu quo personnes physiques sans structure** : LCEN oblige à publier nom, prénom,
  domicile (art. 6-III) — **incompatible avec T2 sans l'exception non-professionnel, qui ne
  s'applique pas ici** (activité commerciale/rémunérée). Dans ce cas, le fallback actuel
  (« Thomas et Emmanuel ») n'est PAS un texte à corriger par une reformulation : c'est déjà, en
  l'état, la version conforme la moins mauvaise. Le retirer sans société créée expose à un vrai
  vide de conformité. **Ne pas trancher ce point par du copywriting — c'est une décision de
  statut juridique.**

### Confidentialité (`src/app/confidentialite/page.tsx`)
Remplacer L19 par :
> « Parrainly est édité par [entité identifiée dans les Mentions légales]. Le responsable de
> traitement des données collectées sur le site est cette même entité, dont l'identité complète
> figure dans les Mentions légales. »

Techniquement : réutiliser `LEGAL_EDITOR_NAME` (import depuis `@/config/socle`, comme le fait déjà
`mentions-legales/page.tsx`) plutôt que du texte en dur, avec un lien `<Link href="/mentions-legales">`
au lieu de répéter l'identité en clair — évite la désynchronisation entre les deux pages et
satisfait l'art. 13 RGPD (identité + moyen de contact) par renvoi, ce qui est une pratique
courante et admise tant que le renvoi est direct et sans friction.

### Bandeau de divulgation (`src/components/ui/DisclosureBanner.tsx`)
Remplacer L12 :
> « Lien de parrainage {nomProgramme} : Parrainly perçoit un avantage si vous l'utilisez pour vous
> inscrire. Aucun frais supplémentaire pour vous. Non affilié officiellement à {nomProgramme}. »

(Suppression de « (Thomas et Emmanuel) » — « Parrainly » seul seul suffit comme identifiant
public, le lien « Comment ça marche » vers `/divulgation` puis vers les mentions légales assure
la traçabilité de l'identité réelle.)

### Footer (`src/components/layout/Footer.tsx`)
Remplacer L54 :
> « Parrainly référence des liens de parrainage réels appartenant à l'éditeur de ce site, qui
> perçoit un avantage si vous les utilisez. Parrainly n'est affilié officiellement à aucun des
> programmes listés. Investir comporte des risques de perte en capital. »

---

## Points à trancher par le fondateur (non arbitrés ici)

1. **Statut juridique porteur du site** — société (SASU/SARL) créée avant mise en ligne
   publique réelle, EI/auto-entrepreneur avec nom commercial distinct, ou statu quo personnes
   physiques. C'est LE point qui détermine si T2 est atteignable sans trou de conformité LCEN.
   Ce point était déjà `[À VALIDER]` dans `docs/legal/legal-strategy.md` (Hypothèses à valider) ;
   T2 le rend bloquant, pas optionnel.
2. **Calendrier** : le pilote est-il en accès restreint (pas encore d'exposition publique réelle
   aux moteurs/IA) le temps que la structure soit créée, ou la mise en ligne publique est-elle
   déjà effective ? Si déjà live publiquement avec le fallback actuel nommant Thomas/Emmanuel,
   ce fallback est risqué pour d'autres raisons (CGU des 9 programmes, cf. `legal-strategy.md`
   §4) mais N'EST PAS en soi une violation LCEN (il identifie bien un éditeur). Le risque LCEN
   n'apparaît QUE si les noms sont retirés sans rien mettre derrière.
3. **Renseignement effectif des variables d'environnement** `LEGAL_EDITOR_NAME`,
   `LEGAL_PUBLICATION_DIRECTOR`, `LEGAL_HOST`, `LEGAL_CONTACT_EMAIL` avec les vraies valeurs une
   fois la structure choisie — décision opérationnelle, pas juridique, mais bloquante pour la
   mise en ligne conforme (cf. `.env.example`).
4. **Cohérence du wording final** : valider auprès de @copywriter que « l'éditeur de ce site »
   / « Parrainly » est le wording retenu partout (pas de variante par fichier), pour éviter
   qu'une IA citant une page reprenne un terme différent d'une autre page sur le même fait.

---

## Bloc Vérifié (G_PROOF)

Fichiers lus intégralement : `docs/audit/AUDIT-BRIEF.md`, `src/app/divulgation/page.tsx`,
`src/app/mentions-legales/page.tsx`, `src/app/confidentialite/page.tsx`,
`src/components/ui/DisclosureBanner.tsx`, `src/components/layout/Footer.tsx`,
`src/config/socle.ts` (L94-133, section contact/identité légale), `src/components/legal/LegalContact.tsx`,
`docs/legal/legal-strategy.md` (intégral), `docs/legal/textes/03-mentions-legales.md`,
`docs/legal/textes/05-divulgation-affiliation.md`, `docs/legal/textes/02-politique-confidentialite.md`,
`project-context.md` (L1-60).
WebSearch effectué cette session : LCEN art. 6-III/6-VI (obligations d'identification, sanctions,
exception non-professionnel) — sources ci-dessous, 0 chiffre inventé (1 an/75 000 € confirmé par
recherche, pas repris de mémoire).
Non lu dans cette session (hors périmètre strict de la question posée, signalé pour suite) :
snapshot `divulgation.html` (fichier trop volumineux pour lecture complète, contenu déjà couvert
par la lecture du composant source `page.tsx` qui le génère à l'identique en rendu statique),
`src/lib/content/faq-enrichie.ts`, `src/lib/ai/site.ts`, `src/app/llms.txt/route.ts` (mentionnés en
P1-2 comme suite logique, non audités ligne à ligne ici).

**Sources WebSearch** :
- [Article 6 - Loi n° 2004-575 du 21 juin 2004 (LCEN) — Légifrance](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000042038977/2020-06-26/)
- [L'article 6 de la LCEN ou la responsabilité du gérant d'un site internet](https://www.loi1881.fr/article-6-lcen)
- [Mentions légales d'un site internet : obligations, sanctions et modèle — Me Valentin Simonnet](https://www.simonnetavocat.fr/mentions-legales-dun-site-internet-obligations-sanctions-et-modele/)
- [La répression du défaut de mentions légales des sites internet — Lexing Avocats](https://www.lexing.law/avocats/repression-defaut-mentions-legales-site-internet/2019/08/02/)

---

## Verdict final

**Note : 4/10** (état actuel du code face à T2, si exécuté sans décision de structure préalable).
**Retrait des noms propres compatible avec la conformité ? SOUS CONDITIONS.** La divulgation
d'affiliation est reformulable sans aucun prénom sans perte de conformité (oui, directement). Les
mentions légales et la politique de confidentialité ne le sont QUE si une décision de structure
juridique (société ou EI à nom commercial) est prise en amont et que `LEGAL_EDITOR_NAME` est
renseigné avec une vraie identité avant mise en ligne publique — sans cette décision, retirer les
prénoms crée un vide d'identification LCEN (P0-1), sanctionné pénalement, qui n'existe pas
aujourd'hui dans le fallback actuel (lequel nomme Thomas et Emmanuel, ce qui est conforme sur ce
point précis mais contredit T2).

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/audit/legal-audit-2.md`
- Décisions prises : aucune tranchée (audit de faisabilité) — recommandation forte de trancher le
  statut juridique porteur AVANT tout retrait de code sur les mentions légales/confidentialité ;
  la divulgation peut être reformulée dès maintenant sans risque.
- Points d'attention : (1) `mentions-legales/page.tsx` et `confidentialite/page.tsx` ne doivent pas
  être édités pour retirer les prénoms tant que le point 1 des « Points à trancher » n'est pas
  décidé par le fondateur ; (2) `DisclosureBanner.tsx`, `divulgation/page.tsx`, `Footer.tsx` peuvent
  être corrigés dès maintenant (P1-1, sans risque) ; (3) faire valider par un avocat le choix de
  structure et la formulation finale des mentions légales avant mise en ligne publique réelle ;
  (4) notifier @fullstack (implémentation des formulations + cohérence `LEGAL_EDITOR_NAME` entre
  les deux pages legal) une fois la décision de structure prise.
---
