// GET /api/audit/status?id=AUDIT_ID
// Response: { audit_id, status, pdf_url|null, error|null, updated_at }

import { getAudit } from '../_lib/store.js';

export default async function handler(req, res){
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const id = (req.query && req.query.id) ? String(req.query.id).slice(0, 100) : null;
  if (!id) return res.status(400).json({ error: 'id query param is required' });

  const audit = await getAudit(id);
  if (!audit) return res.status(404).json({ error: 'audit not found' });

  // Public projection — never leak internal request metadata
  return res.status(200).json({
    audit_id: audit.audit_id,
    status: audit.status,
    pdf_url: audit.pdf_url || null,
    error: audit.error || null,
    updated_at: audit.updated_at,
  });
}
