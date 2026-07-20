import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { db } from '@/db';

/**
 * Health check — /api/health (protocole @infrastructure).
 * Execute un `SELECT 1`. Si la DB est injoignable : statut "degraded" (jamais de crash / 500).
 */
export const dynamic = 'force-dynamic';

export function GET() {
  let dbOk = false;
  try {
    db.get(sql`SELECT 1`);
    dbOk = true;
  } catch {
    dbOk = false;
  }

  return NextResponse.json(
    {
      status: dbOk ? 'ok' : 'degraded',
      service: 'parrainly',
      db: dbOk ? 'up' : 'down',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
