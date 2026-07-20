/**
 * POST /api/v1/auth/logout — deconnexion (invalide la session + supprime le cookie).
 */
import { NextResponse, type NextRequest } from 'next/server';
import { destroySession } from '@/lib/auth';
import { SESSION_COOKIE } from '@/config/socle';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  try {
    await destroySession(raw);
  } catch {
    // best-effort
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
