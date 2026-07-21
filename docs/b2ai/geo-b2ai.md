<!-- Version: 2026-07-21 — @geo — Lecture GEO/distribution-IA du B2AI (base Parrainly) -->
# B2AI vu par @geo — Citabilité, autorité d'entité, défendabilité

> Lentille : être vu et CITÉ par les moteurs de réponse. Ce document répond aux 3 questions du brief
> `docs/b2ai/BRIEF-B2AI.md` depuis l'angle GEO, en s'appuyant sur `docs/geo/geo-strategy.md`,
> `docs/geo/monitoring-citations.md` et `docs/geo/faisabilite-geo-parrainage-ia.md` (déjà produits).

---

## 0. GEO en 3 paragraphes (rappel pédagogique, pour qui découvre le sujet)

Le SEO optimise pour être cliqué dans une liste de liens ; le GEO (Generative Engine Optimization) optimise pour être **cité dans la réponse générée** par un assistant IA. Un moteur de réponse ne classe pas des pages, il sélectionne des passages de texte autonomes et datés, dans des sources qu'il juge fiables et fraîches, puis les cite ou les paraphrase, avec ou sans lien cliquable derrière.

Le B2AI tel que cadré dans le brief (« construire des actifs conçus pour être consommés et cités par les IA ») est donc, dans le vocabulaire GEO, un pari sur devenir **la source de référence structurée** d'une niche de données qui périme vite (codes, prix, disponibilité) — exactement le terrain où un modèle ne peut pas répondre depuis sa mémoire et DOIT chercher une source fraîche au moment de la requête.

La nuance essentielle que ce document ajoute à `docs/geo/faisabilite-geo-parrainage-ia.md` (déjà GO sur le contenu web cité) : être cité n'est plus l'unique finalité du GEO en 2026. Une partie croissante des moteurs de réponse **agit** (achat en un clic, exécution de code, remplissage de formulaire) sans forcément citer ni renvoyer de trafic. Le B2AI doit donc viser deux choses distinctes, pas une seule : (1) être la source citée, (2) être la source **consommée** par l'agent au moment où il agit — la seconde ne garantit pas la première.

---

## Q1 — Le B2AI est-il une direction solide ou fragile ?

**Verdict : direction solide sur le principe (être une source fraîche/structurée sur une donnée périssable), mais fragile en tant que MODÈLE ÉCONOMIQUE si elle dépend d'un clic de sortie que l'IA a de moins en moins de raisons de fournir.** Les deux faits ne se contredisent pas : le GEO reste un jeu réel et gagnable côté citabilité, mais la citation seule ne finance rien tant qu'elle ne débouche pas sur un clic ou une conversion traçable.

**Ce qui rend la direction solide (why-now réel, pas un effet de mode) :**
1. Le zero-click est devenu la norme, pas l'exception : le taux de recherches sans clic est passé d'environ 50% en 2019 à environ 65-68% des requêtes en 2026 (repère marché, source secondaire agrégée, `[HYPOTHÈSE — non institutionnel]`). Ce n'est pas un risque à éviter, c'est **le terrain de jeu lui-même** : le B2AI parie que si le clic diminue globalement, la valeur se concentre sur les quelques sources que l'IA choisit de citer plutôt que de se répartir sur 10 liens bleus.
2. Cette concentration a une valeur mesurable pour la source citée : les marques citées dans une réponse IA obtiennent un uplift de clic significatif face aux marques non citées sur la même page de résultats, et le trafic issu des citations IA convertirait à un taux nettement supérieur au trafic organique classique (repères marché 2026, `[HYPOTHÈSE — non re-vérifiable sur données propriétaires, source secondaire]`). Le B2AI ne cherche donc pas à récupérer le clic perdu du zero-click général, il cherche à capter la part concentrée qui reste sur les sources citées.
3. Le terrain de la donnée périssable (parrainage, codes, prix, disponibilité) est structurellement défavorable à la mémoire paramétrique d'un LLM et favorable à une source fraîche vérifiée : c'est le seul type de contenu qu'un modèle DOIT aller chercher en direct plutôt que réciter, ce qui protège partiellement de la compression généraliste du web par les moteurs de réponse.

**Le risque structurel n°1 (le plus important à nommer sans l'édulcorer) : la désintermédiation par l'agent transactionnel, pas seulement par la citation sans clic.** Deux phénomènes distincts, cumulatifs :
- **Zero-click classique** : l'IA cite ou paraphrase la donnée (le code, le montant) sans generer de clic vers la page source. Pour Parrainly, un modèle peut restituer « le code de parrainage Qonto est X » sans jamais renvoyer l'utilisateur vers `parrainly.fr`, cassant le mécanisme d'attribution `/r/{token}` qui est le seul lien entre citation et NSM (PCA-IA/mois).
- **Agentic commerce (plus grave, en accélération en 2026)** : au-delà de citer, certains assistants achètent ou agissent directement (Perplexity Buy avec checkout en un clic, agents shopping ChatGPT/Amazon Rufus). Amazon a par exemple engagé une action contre Perplexity pour des achats non autorisés effectués par son agent en 2026 (signal que la friction juridique sur l'agent qui agit sans passer par le site marchand est déjà un contentieux réel, pas une hypothèse). Pour un modèle comme Parrainly qui vit de la commission sur une conversion tracée via un lien de parrainage personnel, un agent qui appliquerait un code ou soumettrait un formulaire de parrainage pour le compte de l'utilisateur SANS repasser par l'URL de redirection `/r/{token}` court-circuite l'attribution à la source — et donc la commission — même si Parrainly a bien été « consommé » comme source de données.
- **Conséquence directe pour Parrainly** : la gouvernance déjà tranchée dans `geo-strategy.md` §3 (ne jamais exposer `url_parrainage`, le lien d'affiliation personnel, dans le JSON-LD ni le miroir ; seule `url_offre`, la page canonique, est exposée) est la bonne protection de premier niveau contre ce risque — un agent qui veut appliquer le code DOIT repasser par la page Parrainly pour obtenir le lien réel. C'est un garde-fou déjà posé, pas à ajouter, mais il faut le documenter explicitement comme rempart anti-désintermédiation, pas seulement comme protection de rotation V2.

**Autre fragilité structurelle, distincte du zero-click : la dépendance à des acteurs qui changent unilatéralement leurs règles.** Un changement d'algorithme de citation, une politique anti-crawl plus stricte d'une plateforme IA, ou l'intégration native d'un concurrent structuré directement dans l'index d'un moteur de réponse peuvent effacer une position acquise du jour au lendemain — le B2AI n'a aucun contrat, aucun SLA avec les plateformes qui le citent. C'est un risque déjà partiellement mitigé par la stratégie multi-plateformes de `geo-strategy.md` §7 (ne pas dépendre d'un seul moteur), mais il reste un risque de plateforme non éliminable, à traiter comme une dépendance externe permanente et non comme un problème résolu une fois.

**Verdict final Q1** : le B2AI est une direction 10x défendable SI et seulement si (a) la gouvernance anti-désintermédiation du lien d'affiliation est maintenue sans exception et étendue à tout futur produit B2AI (jamais exposer le lien monétisable brut, toujours forcer un passage par la page canonique), et (b) le monitoring de citations reste couplé au NSM réel (redirection trackée), pas seulement à la mesure « suis-je cité » — sans quoi le B2AI mesurerait de la visibilité sans jamais savoir si elle se traduit en revenu.

---

## Q2 — Briques GEO à ajouter après Parrainly (ordonnées)

Ordre posé par dépendances (chaque brique s'appuie sur la précédente), pas par sprint. Les briques déjà assignées dans `geo-strategy.md` §6 (FAQ par offre, page `/divulgation`, `mainEntityOfPage`) ne sont pas répétées ici : elles restent le socle Phase 3 en cours. Ce qui suit est la suite, au-delà de la page individuelle.

1. **Automatiser la re-vérification de fraîcheur plutôt que la laisser dépendre d'une action manuelle de Thomas/Emmanuel.** Verbe + objet : construire un processus (cron ou tâche planifiée) qui force le statut d'une offre `actif` à basculer automatiquement en `en_attente_verification` si `date_verification` dépasse un seuil défini (ex. 30 jours), plutôt que de compter sur une vérification humaine récurrente non garantie. Critère de done : 0 offre `actif` avec une `date_verification` de plus de 30 jours sans passage automatique de statut. **Pourquoi en premier** : la fraîcheur vérifiée est LE claim de différenciation identifié face aux incumbents (`geo-strategy.md` §1) ; si elle reste un processus manuel, elle s'effondre dès que le catalogue dépasse 9 offres — c'est le socle qui protège tous les gains de citabilité suivants.

2. **Verrouiller en garde-fou technique (pas seulement en convention) l'interdiction d'exposer un lien monétisable brut, pour toute nouvelle brique ou verticale.** Verbe + objet : ajouter un check automatisé (test CI ou script de vérification pré-publication) qui échoue si `url_parrainage` apparaît dans une réponse publique (HTML, JSON-LD, miroir `/api/v1`, `/llms.txt`). Critère de done : le check bloque tout déploiement qui exposerait le lien brut. **Pourquoi en second** : c'est le rempart direct contre le risque de désintermédiation identifié en Q1 ; il doit être posé AVANT d'étendre le catalogue ou d'ouvrir la marketplace V2, pas après, sans quoi chaque nouvelle verticale répète le risque au lieu de le fermer une fois pour toutes.

3. **Étendre le cluster d'entité aux verticales déjà annoncées (Télécom & Énergie, Mobilité, `project-context.md`) en respectant le même patron structurel que les 6 catégories actuelles.** Verbe + objet : publier une page catégorie (définition directe + `ItemList`) et au moins 3 fiches-offre vérifiées par nouvelle verticale avant de l'activer publiquement. Critère de done : 0 nouvelle catégorie visible avec moins de 3 offres `actif` et `date_verification` renseignée. **Pourquoi en troisième** : élargit l'autorité d'entité (cluster couvrant plus de facettes du domaine, cf. protocole entity-first) sans dépendre d'aucune brique externe, mais seulement une fois 1 et 2 posés (sinon on scale un processus de vérification fragile et un risque d'exposition non fermé).

4. **Construire une présence tierce off-site mesurable, pas seulement on-site.** Verbe + objet : établir une présence dans au moins un canal off-site pertinent par trimestre (forum ou communauté française équivalente aux subreddits deal-hunters, earned media ciblant la presse spécialisée finance/parrainage, profils cross-plateforme). Critère de done : au moins 1 mention indexée et traçable par trimestre, distincte du site propre. **Pourquoi en quatrième** : la littérature GEO générale situe Reddit/forums comme source majoritaire des citations Perplexity (~47%, déjà cité dans `geo-strategy.md` §7) ; investir cet off-site n'a de sens qu'une fois le contenu on-site fiable (1-3), sinon on attire l'attention sur un contenu pas encore prêt à être cité avec exactitude.

5. **Inscrire l'entité dans le knowledge graph externe dès l'immatriculation de la société.** Verbe + objet : créer/mettre à jour une fiche Wikidata (si notoriété suffisante), une fiche Crunchbase, une page LinkedIn Company officielle, et les relier en `sameAs` depuis `organizationJsonLd`. Critère de done : au moins 2 profils cross-plateforme actifs et reliés en `sameAs`. **Pourquoi en cinquième, pas avant** : dépend explicitement de la condition déjà posée dans `project-context.md` (société en cours de constitution) — publier une identité d'entité externe avant l'immatriculation serait prématuré et potentiellement à défaire.

6. **Publier un digest récurrent daté, citable en tant que passage autonome, au-delà des pages-offre individuelles.** Verbe + objet : produire un contenu de synthèse mensuel type « État du parrainage vérifié [mois/année] : N offres actives, N mises à jour, N retraits » avec date en tête, format definition directe. Critère de done : 1 publication mensuelle, jamais un mois sans mise à jour même si aucun changement (dire explicitement « aucun changement depuis le [date] » plutôt que ne rien publier). **Pourquoi en dernier** : ce format profite de tout ce qui précède (fraîcheur fiable, cluster large, présence off-site) pour devenir lui-même une source secondaire citable et un contenu de type cornerstone à rafraîchir selon la cadence documentée dans `monitoring-citations.md`.

7. **Basculer le monitoring vers un outil payant dédié une fois le volume de requêtes-test dépasse la capacité manuelle.** Déjà posé comme décision différée dans `monitoring-citations.md` §6, rappelé ici pour l'ordre : c'est la dernière brique, déclenchée par le volume réel (plusieurs verticales, plusieurs dizaines d'offres), pas anticipée.

---

## Q3 — Autres sujets B2AI à haute citabilité IA

Critère de sélection commun aux 4 idées : ce sont des terrains où (a) la donnée périme ou change assez souvent pour qu'un LLM ne puisse pas répondre depuis sa mémoire seule, (b) une réponse fausse est risquée pour l'utilisateur (donc le modèle a une incitation à préférer une source vérifiée plutôt qu'inventer), et (c) l'équipe (2 personnes + agents) peut réutiliser une méthodologie de vérification déjà construite plutôt que d'en inventer une nouvelle. Aucun chiffre de marché n'est avancé, faute de donnée propriétaire.

**1. Registre des statuts réglementaires vérifiés des acteurs fintech/crypto français (agréments PSAN/MiCA, enregistrement CIF-AMF, ORIAS).**
- *Pourquoi l'IA cite* : « Kraken est-il agréé PSAN aujourd'hui ? », « Ramify est-il un CIF enregistré AMF ? » sont des questions à fort risque d'hallucination (le statut réglementaire change, une erreur a des conséquences réelles pour l'utilisateur) — exactement le type de requête où un modèle prudent préfère une source datée à une réponse générée.
- *Fraîcheur/structure clé* : date de vérification exacte face au registre officiel (ORIAS, AMF, ACPR), statut structuré en JSON-LD (`Organization` + propriété personnalisée type `hasCredential`), reprise directe de la méthodologie déjà produite par @legal (`docs/legal/fiches-conformite/`, `docs/legal/statut-psca-kraken-meria.md`).
- *Monétisation* : lead generation vers les fintechs elles-mêmes (être listé comme « vérifié » devient un argument marketing pour elles), ou accès B2B (conseillers, autres affiliés) à un flux de données vérifiées.
- *Défendabilité* : la vérification manuelle contre des registres officiels est un travail réel non trivialement copiable en volume ; c'est un actif déjà à moitié construit (fiches-conformité existantes) plutôt qu'un nouveau chantier.

**2. Registre des CGU d'affiliation/parrainage (« ce lien est-il partageable publiquement ? ») à destination des autres affiliés.**
- *Pourquoi l'IA cite* : un agent ou un affilié qui demande « puis-je publier mon lien de parrainage Trade Republic sur mon site ? » n'a aujourd'hui aucune source structurée pour répondre — c'est un angle mort déjà découvert dans ce projet (`project-context.md`, ligne 104 : Trade Republic et Kraken interdisent la diffusion publique, information non structurée ailleurs).
- *Fraîcheur/structure clé* : une CGU change rarement mais sans préavis ; date de dernière lecture du texte CGU + citation de la clause exacte, format Q/R par programme.
- *Monétisation* : produit B2B2C, vendu ou proposé en freemium aux affiliés/créateurs de contenu (audience différente des utilisateurs finaux de Parrainly), ou sponsoring des marques qui veulent apparaître en « diffusion autorisée ».
- *Défendabilité* : réutilise directement le travail déjà fait par @legal pour 9 programmes, l'extension à d'autres programmes est un travail de vérification incrémental, pas une reconstruction.

**3. Comparateur de primes de bienvenue directes (hors parrainage) en temps réel, sur les mêmes catégories déjà couvertes.**
- *Pourquoi l'IA cite* : `test-citation-ia.md` documente que Parrainly perd déjà le terrain générique (« meilleure néobanque 2026 ») face aux comparateurs classiques faute de contenu adapté à cette intention. Un registre de primes de bienvenue directes (pas liées à un parrainage) répond à la MÊME intention générique que Parrainly perd aujourd'hui, avec la même infrastructure de vérification.
- *Fraîcheur/structure clé* : montant et conditions de la prime changent souvent (mensuel), donnée `Offer`/`priceValidUntil` déjà maîtrisée techniquement (`jsonld.ts`).
- *Monétisation* : même mécanisme d'affiliation que Parrainly, mais capte une intention de recherche plus large (l'utilisateur qui n'a pas de parrain disponible n'est aujourd'hui pas servi du tout).
- *Défendabilité* : coût marginal faible (même stack, même catalogue de marques, nouveau type de donnée par offre), mais différenciation moyenne si les comparateurs actuels ajoutent la fraîcheur datée en réaction — reste un gain d'usage rapide, pas un moat à long terme isolé, seulement en tant qu'extension de 1-2.

**4. Registre d'éligibilité par statut (auto-entrepreneur, société, SCI, holding) sur les offres bancaires pro et compta.**
- *Pourquoi l'IA cite* : question de décision fréquente et précise pour le persona Karim/entrepreneur déjà validé (`brand-platform.md`) : « Qonto accepte-t-il les auto-entrepreneurs ? », « Dougs gère-t-il une SCI ? » — une réponse générique est souvent fausse ou incomplète, un modèle prudent préfère une source qui documente l'éligibilité exacte par statut juridique.
- *Fraîcheur/structure clé* : moins volatile que le prix (change par mise à jour de politique commerciale, pas au jour le jour), mais nécessite une vérification factuelle précise par statut, format Q/R par programme x statut juridique.
- *Monétisation* : même mécanisme d'affiliation, capte une requête de qualification en amont de la décision (potentiellement plus proche de la conversion qu'une requête de prix pur).
- *Défendabilité* : nécessite une expertise de domaine (critères d'éligibilité réels par programme) plus difficile à répliquer superficiellement qu'un simple comparatif de prix, moat = travail de vérification + relation avec les programmes déjà nouée pour le catalogue actuel.

**Piste non retenue en V1 mais à garder en tête** : un registre de statuts d'incident/disponibilité technique des plateformes elles-mêmes (uptime, statut d'API) est un terrain GEO classique (fraîcheur extrême, citation quasi garantie) mais hors compétence de domaine de l'équipe actuelle (fintech/parrainage) — écarté pour ne pas disperser l'effort de 2 personnes.

---

## Gates vérifiées

- **G1** : 4 sections traitées (pédagogie, Q1, Q2, Q3), aucune < 2 lignes.
- **G3** : bloc Handoff structuré en fin de document.
- **G5** : personas Karim/entrepreneur repris depuis `brand-platform.md` (Q3 point 4), aucun persona générique réintroduit.
- **G7** : aucune contradiction avec `geo-strategy.md`, `monitoring-citations.md`, `faisabilite-geo-parrainage-ia.md` ou `test-citation-ia.md` — le risque de désintermédiation (Q1) prolonge et documente explicitement le garde-fou `url_parrainage` déjà posé par @ia/@geo, sans le redéfinir ; le terrain générique perdu (Q3.3) est repris tel quel depuis `test-citation-ia.md` §4.
- **G12** : Q2 formulée en verbe + objet + critère de done, ordonnée par dépendances explicites.
- **G13** : 0 chiffre inventé sur Parrainly ; les statistiques marché (zero-click, uplift CTR, croissance trafic IA) sont sourcées par WebSearch daté du jour et marquées `[HYPOTHÈSE — non institutionnel]` ou équivalent, jamais présentées comme des mesures propres au projet.
- **G15** : 0 placeholder résiduel.
- **G17** : Q3 spécifique au catalogue réel (9 programmes, catégories, personas déjà validés), non copiable tel quel par un tiers sans le même travail de vérification.

---

### Vérifié (G_PROOF)

- `Read /home/user/MCP/project-context.md` : historique complet des livrables et décisions fondateur (identité, base réelle Emmanuel, choix utilisateur #1 à #4) relu avant rédaction.
- `Read /home/user/MCP/docs/b2ai/BRIEF-B2AI.md` : cadrage B2AI et 3 questions relues avant rédaction.
- `Read /home/user/MCP/docs/geo/geo-strategy.md` : angle de différenciation (§1), gouvernance anti-exposition `url_parrainage` (§3), entity-first (§5), patterns par plateforme (§7) réutilisés sans redéfinition.
- `Read /home/user/MCP/docs/geo/monitoring-citations.md` : baseline de citation à J0 (0/11), lien NSM/attribution (§7), outillage (§6) réutilisés sans redéfinition.
- `Read /home/user/MCP/docs/geo/faisabilite-geo-parrainage-ia.md` : verdict MCP grand public NO-GO / contenu web cité GO, concurrence identifiée, réutilisés sans redéfinition.
- `WebSearch` (2026-07-21) « zero-click AI search 2026 citations without traffic referral loss statistics » : confirme la prévalence du zero-click (~65-68% des requêtes en 2026 selon repères marché agrégés) et l'uplift de clic pour les marques citées (35% CTR organique, 91% CTR payant) vs non citées — sourcé pour Q1, marqué `[HYPOTHÈSE]` car source secondaire agrégée non institutionnelle.
- `WebSearch` (2026-07-21) « generative engine optimization best verticals 2026 structured data AI citation pricing real-time » : confirme que la structuration/l'entité/la fraîcheur restent les leviers centraux cités par la littérature GEO 2026, cohérent avec Q2/Q3.
- `WebSearch` (2026-07-21) « Perplexity ChatGPT AI agent shopping code execution without citing source 2026 » : confirme l'essor de l'agentic commerce (Perplexity Buy, checkout en un clic) et un contentieux réel (action d'Amazon contre Perplexity pour achats non autorisés par agent) — utilisé comme preuve du risque de désintermédiation en Q1, pas comme chiffre de marché.

---
**Handoff → @orchestrator**
- Fichiers produits : `/home/user/MCP/docs/b2ai/geo-b2ai.md`
- Décisions prises : verdict Q1 = direction solide sur le principe (donnée périssable + zero-click qui concentre la valeur sur les sources citées) mais fragile en modèle économique si la désintermédiation par l'agent transactionnel (agentic commerce) n'est pas explicitement traitée comme un risque permanent, pas résolu une fois ; Q2 = 7 briques ordonnées par dépendance, la première (automatiser la re-vérification de fraîcheur) et la deuxième (garde-fou technique CI anti-exposition du lien monétisable) posées comme prérequis avant toute extension de catalogue ou de verticale ; Q3 = 4 sujets B2AI retenus, tous réutilisant une méthodologie de vérification déjà construite dans ce projet (fiches-conformité @legal, infra JSON-LD @ia, catalogue/personas déjà validés) plutôt que d'ouvrir un chantier neuf
- Points d'attention : le risque de désintermédiation (Q1) n'est PAS nouveau techniquement (le garde-fou `url_parrainage` existe déjà), mais n'était pas documenté explicitement comme rempart anti-agentic-commerce — à faire relire par @ia/@fullstack pour confirmer que le garde-fou couvre aussi un futur agent qui appliquerait un code sans navigation humaine ; Q3 point 3 (comparateur de primes hors parrainage) a la défendabilité la plus faible des 4 idées (moat faible, réplicable par les comparateurs existants) et ne doit pas être priorisé seul sans les 3 autres ; aucune donnée de conversion ou de volume propre à Parrainly n'existe encore pour arbitrer entre les 4 idées de Q3, l'ordre proposé n'est pas un ordre de priorité financier mais un ordre de réutilisation d'actifs déjà construits
---
