// Interim audit-request storage.
// v0: prefers Vercel KV (set KV_REST_API_URL + KV_REST_API_TOKEN env vars).
// Falls back to in-memory Map for local dev or if KV is not provisioned.
//
// IMPORTANT: in-memory fallback only works within a single function instance —
// it will NOT persist across separate /api invocations. Provision Vercel KV
// before going live, or migrate to belken Postgres core.* schema.
//
// MIGRATION TARGET: core.audit_requests, core.audit_renders, core.audit_deliveries
// in the belken Postgres (100.91.93.127:5432). See docs/AUDIT_WEBAPP.md.

let kv = null;
const memoryStore = new Map();

async function getKv(){
  if (kv === null) {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        // Lazy import so non-KV environments don't crash on cold start
        const mod = await import('@vercel/kv');
        kv = mod.kv;
      } catch (e) {
        console.warn('[audit/store] @vercel/kv import failed, falling back to memory:', e.message);
        kv = false;
      }
    } else {
      kv = false;
    }
  }
  return kv;
}

const key = (auditId) => `audit:${auditId}`;

export async function putAudit(audit){
  const client = await getKv();
  if (client) {
    await client.set(key(audit.audit_id), audit);
  } else {
    memoryStore.set(audit.audit_id, audit);
  }
  return audit;
}

export async function getAudit(auditId){
  const client = await getKv();
  if (client) {
    return await client.get(key(auditId));
  }
  return memoryStore.get(auditId) || null;
}

export async function updateAudit(auditId, patch){
  const existing = await getAudit(auditId);
  if (!existing) return null;
  const next = { ...existing, ...patch, updated_at: new Date().toISOString() };
  await putAudit(next);
  return next;
}

// Quick uuid (good enough for v0 — replace with crypto.randomUUID in prod if needed)
export function newAuditId(){
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'au_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
