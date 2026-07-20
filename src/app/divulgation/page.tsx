/** Page « Divulgation d'affiliation / Comment ça marche » (US-08, docs/legal/textes/05). Rendu statique. */
import type { Metadata } from 'next';
import { LegalShell } from '@/components/legal/LegalShell';
import { LegalContact } from '@/components/legal/LegalContact';
import { absUrl } from '@/lib/ai/site';
import { faqPageJsonLd, jsonLdString } from '@/lib/ai/jsonld';
import { FAQ_ENRICHIE } from '@/lib/content/faq-enrichie';

export const metadata: Metadata = {
  title: 'Comment ça marche : divulgation de l\'affiliation',
  description: "Comment Parrainly gagne de l'argent et pourquoi cela ne change rien pour vous.",
  alternates: { canonical: absUrl('/divulgation') },
};

export default function DivulgationPage() {
  return (
    <LegalShell title="Comment Parrainly gagne de l'argent (et pourquoi ça ne change rien pour vous)">
      <p>
        Parrainly référence des programmes de parrainage réels (banques, plateformes d&apos;investissement,
        plateformes crypto, services aux entreprises). Chaque fiche que vous consultez contient un lien de
        parrainage personnel appartenant à Thomas ou à Emmanuel, les deux personnes qui construisent Parrainly.
      </p>
      <p>
        <strong>Ce que ça signifie concrètement :</strong> si vous vous inscrivez à un programme via un des liens
        présentés sur ce site, Thomas ou Emmanuel reçoit un avantage (prime en argent, mois offert, selon le
        programme), exactement comme n&apos;importe quel parrainage personnel entre proches. Il n&apos;y a aucun
        frais supplémentaire pour vous, et aucune commission n&apos;est prélevée sur votre argent : c&apos;est le
        programme tiers qui verse la prime, pas vous.
      </p>
      <p>
        <strong>Pourquoi on vous le dit aussi clairement :</strong> la loi française (loi n° 2023-451 du 9 juin
        2023 sur l&apos;influence commerciale, et le Code de la consommation) nous oblige à être transparents sur
        cette relation commerciale, et on trouve ça normal. Vous devez savoir pourquoi un lien est présenté et à
        qui il profite.
      </p>
      <p>
        <strong>Comment on choisit les programmes présentés :</strong> chaque fiche est vérifiée avant
        publication (date de dernière vérification affichée sur la fiche) et retirée ou mise en pause si les
        conditions changent ou si le lien ne fonctionne plus. Nous ne présentons pas les programmes par ordre de
        « meilleur choix » : les fiches sont descriptives, pas des recommandations personnalisées. À vous de
        vérifier, sur le site du programme concerné, que ses conditions vous conviennent avant de vous inscrire.
      </p>
      <p>
        <strong>Si vous voyez ce lien cité par une IA (ChatGPT, Claude, Perplexity, Gemini) :</strong> la même
        relation commerciale s&apos;applique. Nous rappelons cette mention directement dans les données que nous
        fournissons aux assistants IA, pour qu&apos;elle soit reprise autant que possible, mais nous ne
        contrôlons pas entièrement la façon dont chaque assistant reformule sa réponse.
      </p>
      <p>
        <strong>Produits financiers et crypto-actifs :</strong> investir comporte des risques de perte en
        capital. Les crypto-actifs sont des actifs risqués dont la valeur peut fortement varier. La prime de
        parrainage ne compense ni ne couvre ce risque : c&apos;est un avantage de bienvenue, pas une performance
        du produit financier lui-même.
      </p>
      <p>Une question, un désaccord avec une fiche ? Contactez-nous via <LegalContact />.</p>

      {/* FAQ enrichie (18 Q/R) — contenu extractible visible + FAQPage JSON-LD (geo-strategy §6 action 1-2).
          Le JSON-LD reflete le texte affiche ci-dessous (conforme aux regles Rich Results de Google). */}
      <section aria-labelledby="faq-divulgation" className="mt-xl">
        <h2 id="faq-divulgation">Questions fréquentes sur le fonctionnement et la vérification</h2>
        <div className="mt-md flex flex-col gap-sm">
          {FAQ_ENRICHIE.map((f) => (
            <details key={f.q} className="rounded-lg border border-line bg-surface-card p-lg">
              <summary className="cursor-pointer font-medium text-content-primary">{f.q}</summary>
              <p className="mt-sm text-sm text-content-secondary">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqPageJsonLd(FAQ_ENRICHIE)) }}
      />
    </LegalShell>
  );
}
