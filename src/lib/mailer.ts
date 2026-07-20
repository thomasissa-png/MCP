/**
 * Envoi d'email PLUGGABLE. Transport selectionne par env `MAILER_TRANSPORT` :
 *  - 'console' (defaut pilote) : journalise le lien magique dans les logs serveur (testable sans SMTP).
 *  - 'resend'  (prod) : POST vers l'API Resend (RESEND_API_KEY, MAILER_FROM). Documente, non bloquant pilote.
 *
 * Le pilote ne depend d'aucun provider externe : le lien magique est lisible dans les logs.
 */
import { MAILER_TRANSPORT } from '@/config/socle';

export type MailMessage = { to: string; subject: string; text: string };

interface MailTransport {
  send(msg: MailMessage): Promise<void>;
}

const consoleTransport: MailTransport = {
  async send(msg) {
    // eslint-disable-next-line no-console
    console.log(`[mailer:console] -> ${msg.to} | ${msg.subject}\n${msg.text}`);
  },
};

const resendTransport: MailTransport = {
  async send(msg) {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.MAILER_FROM;
    // Garde-fou placeholders : cle reelle attendue (prefixe re_, longueur plausible), sinon on refuse.
    if (!apiKey || !from || !apiKey.startsWith('re_') || apiKey.length < 12) {
      throw new Error('resend_non_configure');
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from, to: msg.to, subject: msg.subject, text: msg.text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`resend_echec_${res.status}`);
  },
};

function transport(): MailTransport {
  return MAILER_TRANSPORT === 'resend' ? resendTransport : consoleTransport;
}

/** Envoie le lien magique de connexion. Renvoie true si l'envoi a reussi, false sinon (jamais throw). */
export async function sendMagicLinkEmail(to: string, url: string): Promise<boolean> {
  try {
    await transport().send({
      to,
      subject: 'Votre lien de connexion Parrainly',
      text: `Bonjour,\n\nVoici votre lien de connexion a l'espace parrain Parrainly :\n${url}\n\nCe lien est valable quelques minutes et ne fonctionne qu'une seule fois.\nSi vous n'etes pas a l'origine de cette demande, ignorez cet email.`,
    });
    return true;
  } catch {
    return false;
  }
}
