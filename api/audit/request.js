// POST /api/audit/request
// Body: { business_name, owner_name, email, phone, industry, location, submitted_at }
// Response: { audit_id, status: 'received' }
//
// Side effects: creates audit record in store, fires RTX render webhook (best-effort).
// If RTX webhook is unreachable, the record is still created — Aria's worker can
// scan for stuck 'received' records and retry.

import { putAudit, newAuditId } from '../_lib/store.js';

const ALLOWED_INDUSTRIES = ['plumbing']; // v1: plumbing only. Add hvac, medspa, etc. as Aria ships templates.

function badRequest(res, message){
  res.status(400).json({ error: message });
}

function sanitize(s, max = 200){
  if (typeof s !== 'string') return '';
  return s.trim().slice(0, max);
}

export default async function handler(req, res){
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }

  let body = req.body;
  // Vercel auto-parses JSON when Content-Type is application/json, but be defensive
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return badRequest(res, 'invalid JSON body'); }
  }
  if (!body || typeof body !== 'object') return badRequest(res, 'missing body');

  const business_name = sanitize(body.business_name);
  const owner_name = sanitize(body.owner_name, 100);
  const email = sanitize(body.email, 200).toLowerCase();
  const phone = sanitize(body.phone, 50);
  const industry = sanitize(body.industry, 30);
  const location = sanitize(body.location, 200);

  if (!business_name) return badRequest(res, 'business_name is required');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return badRequest(res, 'a valid email is required');
  if (!industry || !ALLOWED_INDUSTRIES.includes(industry)) {
    return badRequest(res, `industry must be one of: ${ALLOWED_INDUSTRIES.join(', ')}`);
  }
  if (!location) return badRequest(res, 'location is required');

  const audit_id = newAuditId();
  const now = new Date().toISOString();

  const audit = {
    audit_id,
    business_name,
    owner_name,
    email,
    phone,
    industry,
    location,
    status: 'received',  // received → rendering → emailing → complete (or failed)
    pdf_url: null,
    error: null,
    created_at: now,
    updated_at: now,
    submitted_at: sanitize(body.submitted_at, 50) || now,
    ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || null,
    user_agent: req.headers['user-agent'] || null,
  };

  await putAudit(audit);

  // Fire RTX render webhook (Aria owns the receiver). Don't block response on it —
  // the worker on the RTX side can also poll for 'received' records.
  const rtxUrl = process.env.RTX_RENDER_WEBHOOK_URL;
  const callbackUrl = process.env.PUBLIC_BASE_URL
    ? `${process.env.PUBLIC_BASE_URL.replace(/\/$/, '')}/api/audit/render-callback`
    : null;

  if (rtxUrl && callbackUrl) {
    try {
      // fire and forget — but await a short timeout so we don't return before request lands
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      // RTX_RENDER_WEBHOOK_URL is the base URL of the render server; the endpoint is POST /render
      const renderEndpoint = `${rtxUrl.replace(/\/$/, '')}/render`;
      await fetch(renderEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.RTX_WEBHOOK_SECRET ? { 'x-webhook-secret': process.env.RTX_WEBHOOK_SECRET } : {})
        },
        body: JSON.stringify({
          audit_id,
          business_name,
          industry,
          location,
          customer_email: email,
          callback_url: callbackUrl,
        }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
    } catch (e) {
      console.warn('[audit/request] RTX webhook fire failed (non-fatal):', e.message);
    }
  } else {
    console.warn('[audit/request] RTX_RENDER_WEBHOOK_URL or PUBLIC_BASE_URL not set — audit queued but no render fired');
  }

  return res.status(200).json({ audit_id, status: 'received' });
}
