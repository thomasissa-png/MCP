/**
 * FAQ enrichie Parrainly — 18 Q/R verbatim de docs/copy/faq-enrichie.md (@copywriter, Phase 3).
 *
 * Source unique consommee par :
 *   - la page /divulgation (rendu visible + FAQPage JSON-LD, geo-strategy §6 action 1-2),
 *   - toute future extension AEO (ne JAMAIS diverger du texte valide sans repasser par @copywriter).
 *
 * Distincte des 5 Q/R de l'accueil (docs/copy/homepage-copy.md §5) : aucun doublon verbatim (regle
 * anti-repetition, G7 du livrable copy). Aucun montant ni classement (posture non-conseil).
 */
export type FaqEntry = { q: string; a: string };

export const FAQ_ENRICHIE: FaqEntry[] = [
  // 1. Le mecanisme du registre de parrainage verifie
  {
    q: 'Comment fonctionne un lien de parrainage sur Parrainly ?',
    a: "Un lien de parrainage Parrainly redirige vers le programme concerné (Trade Republic, Qonto, Kraken, etc.) en associant votre visite à Thomas ou Emmanuel, détenteurs réels du lien. Si vous ouvrez un compte ou souscrivez au produit dans les conditions publiées par le programme, le parrain perçoit l'avantage prévu et vous, le filleul, recevez l'avantage publié par le programme s'il en propose un.",
  },
  {
    q: 'Qui détient réellement les liens de parrainage listés sur Parrainly ?',
    a: "Chaque lien appartient personnellement à Thomas ou à Emmanuel, les deux opérateurs du registre. Parrainly ne revend pas de liens appartenant à des tiers non identifiés : la personne physique derrière chaque offre est connue et fixe.",
  },
  {
    q: 'Pourquoi certaines offres du catalogue changent-elles de statut au fil du temps ?',
    a: "Chaque offre porte un statut (actif, en attente, retiré) qui reflète sa disponibilité réelle. Un programme peut modifier ses conditions, suspendre temporairement son parrainage ou atteindre un plafond de filleuls par parrain : le statut est mis à jour en conséquence, plutôt que laissé figé sur une ancienne page.",
  },
  // 2. La verification et la fraicheur des offres
  {
    q: 'À quelle fréquence une offre est-elle revérifiée ?',
    a: "Chaque offre affiche sa date de dernière vérification, contrôlée manuellement par Thomas ou Emmanuel. Une offre n'est pas revérifiée à intervalle fixe universel : elle l'est notamment dès qu'un signalement ou un changement de condition est détecté, et à chaque nouvelle consultation significative.",
  },
  {
    q: 'Que signifie le statut « en attente » sur une fiche ?',
    a: "Le statut « en attente » signale qu'une offre est en cours de contrôle de conformité ou de vérification avant publication complète, par exemple lorsqu'une fiche de conformité CGU du programme n'est pas encore finalisée. Une offre « en attente » n'est pas encore recommandée comme active.",
  },
  {
    q: "Pourquoi Parrainly n'affiche-t-il jamais un lien trouvé sur un forum ou un ancien article ?",
    a: "Un lien recopié depuis un forum ou un article ancien n'a pas de date de contrôle vérifiable et peut pointer vers une offre expirée ou des conditions obsolètes. Parrainly ne source ses fiches que sur des liens que Thomas ou Emmanuel détiennent et contrôlent directement, avec une date de vérification associée.",
  },
  // 3. La divulgation et l'independance de Parrainly
  {
    q: 'Parrainly est-il affilié officiellement aux programmes qu\'il liste ?',
    a: "Non. Parrainly n'est affilié officiellement à aucun des programmes de son catalogue (Trade Republic, Qonto, Revolut Business, Ramify, Finary, Dougs, Meria, Kraken, Spiko). Chaque fiche le rappelle explicitement au-dessus du lien proposé.",
  },
  {
    q: 'Qui gagne quoi quand vous utilisez un lien de parrainage Parrainly ?',
    a: "Le parrain (Thomas ou Emmanuel) perçoit l'avantage publié par le programme si vous ouvrez un compte ou souscrivez au produit dans les conditions prévues. Vous, le filleul, recevez l'avantage publié par le programme s'il en propose un pour les nouveaux clients. Parrainly ne facture rien au filleul pour l'usage du lien.",
  },
  {
    q: 'Parrainly est-il rémunéré par les programmes qu\'il liste, en dehors des primes de parrainage ?',
    a: "Non. En version cercle fermé (V1), Parrainly ne perçoit aucune commission tierce distincte des primes de parrainage revenant directement à Thomas ou Emmanuel : le registre ne vend ni classement ni mise en avant payante.",
  },
  // 4. L'attribution et le suivi d'un parrainage confirme
  {
    q: 'Comment Parrainly sait-il qu\'un parrainage a bien abouti ?',
    a: "Le clic sur un lien de parrainage passe par une redirection propre à Parrainly, qui associe la visite à une offre précise. Les programmes ne transmettant pas de confirmation automatique à un tiers, l'aboutissement final (ouverture de compte effective) repose ensuite sur une confirmation déclarative du parrain, avec un contrôle de plausibilité avant validation.",
  },
  {
    q: 'Un clic sur un lien garantit-il l\'obtention de l\'avantage annoncé ?',
    a: "Non. Le clic ouvre l'accès au parcours d'ouverture du programme concerné. L'avantage n'est obtenu que si l'ensemble des conditions publiées par le programme est rempli (par exemple un dépôt minimum atteint dans le délai imparti), indépendamment du fait d'avoir cliqué sur le lien.",
  },
  // 5. La fiabilite des codes et liens de parrainage
  {
    q: 'Un programme utilise-t-il un lien ou un code de parrainage ?',
    a: "Cela dépend du programme. Certains fonctionnent uniquement par lien direct, d'autres demandent la saisie manuelle d'un code lors de l'inscription. Le mode utilisé (lien, code, ou les deux) est indiqué sur la fiche du programme concerné, avec la même date de vérification que le reste de l'offre.",
  },
  {
    q: 'Que faire si un lien ou un code affiché sur Parrainly ne fonctionne plus ?',
    a: "Chaque fiche affiche un statut. Si une offre signalée « actif » ne fonctionne plus, elle est repassée en « retiré » après contrôle, avant d'être re-proposée si le programme la réactive. Le statut affiché reflète l'état constaté au moment de la dernière vérification, pas une garantie de fonctionnement permanent.",
  },
  {
    q: 'Pourquoi un même programme peut-il apparaître avec des conditions différentes d\'un site à l\'autre ?',
    a: "Les conditions de parrainage publiées par un programme peuvent varier selon la date, la source ou le canal (lien personnel d'un parrain donné, campagne ponctuelle du programme). Parrainly documente les conditions telles qu'observées sur le lien précis détenu par Thomas ou Emmanuel, avec sa date de contrôle, pas une moyenne ou une estimation du marché.",
  },
  // 6. Choisir une offre (posture non-conseil)
  {
    q: 'Quel est le meilleur parrainage pour moi ?',
    a: "Parrainly ne répond pas à cette question par un classement : aucune offre n'est présentée comme supérieure à une autre. Chaque fiche affiche les mêmes champs factuels (avantage filleul, avantage parrain, conditions, statut, date de vérification) pour permettre une comparaison sur des critères vérifiables, propres à votre situation, plutôt qu'un choix pré-mâché. La décision d'ouvrir un compte ou d'investir reste la vôtre.",
  },
  {
    q: 'Pourquoi Parrainly ne classe-t-il pas ses offres par popularité ou par montant ?',
    a: "Un classement suppose de comparer des montants ou des conditions qui évoluent indépendamment les uns des autres et qui ne sont pas équivalents d'un produit financier à l'autre (banque, investissement, crypto). Parrainly documente chaque offre individuellement, avec ses propres conditions et sa propre date de contrôle, plutôt que de les hiérarchiser.",
  },
  {
    q: 'Parrainly peut-il me dire si un produit financier est adapté à ma situation ?',
    a: "Non. Parrainly documente des parrainages, il ne fournit aucun conseil personnalisé en investissement, en épargne ou en choix bancaire. Pour une décision financière engageante, l'évaluation de votre situation personnelle reste la vôtre ou celle d'un professionnel habilité, indépendamment de l'existence d'un avantage de parrainage.",
  },
];
