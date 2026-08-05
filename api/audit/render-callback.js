// POST /api/audit/render-callback
// Body: { audit_id, render_id, status: 'complete'|'failed', pdf_url?, error? }
// Called by Aria's RTX webhook when a render finishes (or fails).
//
// Security: requires x-webhook-secret header matching RTX_WEBHOOK_SECRET env var.

import { getAudit, updateAudit } from '../_lib/store.js';

export default async function handler(req, res){
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  // Shared secret auth (HMAC would be better — punt to v0.5)
  const expectedSecret = process.env.RTX_WEBHOOK_SECRET;
  const providedSecret = req.headers['x-webhook-secret'];
  if (expectedSecret) {
    if (!providedSecret || providedSecret !== expectedSecret) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  } else {
    console.warn('[render-callback] RTX_WEBHOOK_SECRET not set — accepting all callbacks (dev mode)');
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'invalid JSON' }); }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'missing body' });

  const audit_id = typeof body.audit_id === 'string' ? body.audit_id : null;
  const status = typeof body.status === 'string' ? body.status : null;
  if (!audit_id) return res.status(400).json({ error: 'audit_id required' });
  if (!['complete', 'failed', 'rendering', 'emailing'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }

  const existing = await getAudit(audit_id);
  if (!existing) return res.status(404).json({ error: 'audit not found' });

  const patch = { status };
  if (status === 'complete') {
    patch.pdf_url = typeof body.pdf_url === 'string' ? body.pdf_url : null;
    patch.render_id = typeof body.render_id === 'string' ? body.render_id : null;
  }
  if (status === 'failed') {
    patch.error = typeof body.error === 'string' ? body.error : 'render failed (no reason given)';
  }

  const updated = await updateAudit(audit_id, patch);

  // TODO (Aria or Thor): when status === 'complete', also trigger email delivery
  // via Resend/Postmark. v0 leaves this to a manual or RTX-side step.

  return res.status(200).json({ ok: true, audit_id, status: updated.status });
}
