import { NextResponse } from 'next/server';

/**
 * Health check — /api/health (protocole @infrastructure).
 * V1 skeleton : renvoie ok + timestamp. @fullstack ajoutera un SELECT 1 (statut "degraded" si DB down,
 * jamais de crash) une fois le schema et la connexion prod branches.
 */
export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'parrainly',
    timestamp: new Date().toISOString(),
  });
}
