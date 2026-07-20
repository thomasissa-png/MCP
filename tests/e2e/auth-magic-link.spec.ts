/**
 * Auth magic-link (espace parrain, cercle ferme T&E).
 * Flux : demande -> lien capture via mailer console -> verify (cookie session) -> dashboard accessible ;
 * usage unique (2e verify -> consumed) ; email non autorise -> 403.
 */
import { test, expect } from '@playwright/test';
import { THOMAS_EMAIL, requestMagicToken } from './helpers';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3000';

test.describe('Auth magic-link', () => {
  test('email non autorise -> 403 (message neutre, aucun lien emis)', async ({ request }) => {
    const res = await request.post('/api/v1/auth/magic-link', { data: { email: 'intrus@exemple.com' } });
    expect(res.status()).toBe(403);
    expect((await res.json()).error).toBe('non_autorise');
  });

  test('demande -> verify -> cookie session -> dashboard ; usage unique -> consumed', async ({ page, context, request }) => {
    // 1) Demande + capture du lien magique (mailer console). Thomas ici pour ne pas entrer en
    // collision de cooldown avec US-09 (qui utilise Emmanuel, seul detenteur du lien Trade Republic).
    const token = await requestMagicToken(request, THOMAS_EMAIL);

    // 2) Verify : 307 vers le tableau de bord + cookie de session pose
    const verify = await request.get(`/api/v1/auth/verify?token=${token}`, { maxRedirects: 0 });
    expect(verify.status()).toBe(307);
    expect(verify.headers()['location']).toContain('/parrain/tableau-de-bord');
    const setCookie = verify.headersArray().find((h) => h.name.toLowerCase() === 'set-cookie');
    const cookieValue = setCookie?.value.match(/parrainly_session=([^;]+)/)?.[1];
    expect(cookieValue, 'cookie de session emis').toBeTruthy();

    // 3) Le cookie donne acces au tableau de bord (injecte manuellement : cookie Secure sur http local)
    await context.addCookies([
      { name: 'parrainly_session', value: cookieValue as string, url: BASE_URL },
    ]);
    await page.goto('/parrain/tableau-de-bord');
    await expect(page).toHaveURL(/\/parrain\/tableau-de-bord$/);
    // Contenu prouvant l'acces authentifie (pas de redirection vers /parrain/connexion).
    await expect(page.getByText(/Prime estimée cumulée/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mes liens' })).toBeVisible();

    // 4) Usage unique : rejouer le meme lien -> error=consumed
    const reuse = await request.get(`/api/v1/auth/verify?token=${token}`, { maxRedirects: 0 });
    expect(reuse.status()).toBe(307);
    expect(reuse.headers()['location']).toContain('error=consumed');
  });
});
